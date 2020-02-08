import PropertyCondition from "../conditions/propertyCondition";
import IndexStore from "../indexes/indexStore";
import { Filter } from '../query/types';

enum ConditionTypes {
    And,
    Or
}

type QueryPlannerCondition = {
    condition: PropertyCondition;
    type: ConditionTypes;
    results: Set<any>;
}[];

export default class QueryPlanner {
    conditions: QueryPlannerCondition = [];
    filters: Filter<any>[] = []

    entityName: string;

    constructor(entityName: string) {
        this.entityName = entityName;
    }

    public addAndCondition(condition: PropertyCondition) {
        this.conditions.push({
            condition,
            type: ConditionTypes.And,
            results: new Set()
        });
    }

    public addOrCondition(condition: PropertyCondition) {
        this.conditions.push({
            condition,
            type: ConditionTypes.Or,
            results: new Set()
        });
    }

    public addFilter(filter: Filter<any>) {
        this.filters.push(filter)
    }

    public async execute() {
        for (const cond of this.conditions) {
            const btree = IndexStore.getIndex(
                this.entityName,
                cond.condition.property
            );

            for await (const result of await cond.condition.comparator.traverse(
                btree
            )) {
                cond.results.add(result);
            }
        }

        let andResults = this.intersection(
            this.conditions.filter(cond => cond.type == ConditionTypes.And)
        );
        let orResults = this.union(
            this.conditions.filter(cond => cond.type == ConditionTypes.Or)
        );
        return new Set([...andResults, ...orResults]);
    }

    /*
        Make intersection of sets. Take the smallest set an compare each entry 
    */
    private intersection(conditions: QueryPlannerCondition) {
        let smallestSetIdx = conditions.reduce(
            (min, cond, idx) =>
                cond.results.size < min.size
                    ? {
                        conditionIdx: idx,
                        size: cond.results.size
                    }
                    : min,
            {
                conditionIdx: 0,
                size: conditions[0].results.size
            }
        ).conditionIdx;

        for (const result of conditions[smallestSetIdx].results) {
            for (const cond of conditions) {
                if (!cond.results.has(result)) {
                    conditions[smallestSetIdx].results.delete(result);
                }
            }
        }

        return conditions[smallestSetIdx].results;
    }

    private union(conditions: QueryPlannerCondition) {
        // TODO make benchmark
        // let result = new Set;
        // for (const set of array)
        //     for (const element of set)
        //         result.add(element);

        return new Set(
            (function* () {
                for (const cond of conditions) yield* cond.results;
            })()
        );
    }
}
