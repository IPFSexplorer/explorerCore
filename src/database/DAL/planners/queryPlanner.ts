import PropertyCondition from "../conditions/propertyCondition";
import { Filter } from "../query/types";
import DAG from "../../../ipfs/DAG";
import DatabaseInstance from "../database/databaseInstance";
import Database from "../database/databaseStore";

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
    filters: Filter<any>[] = [];
    skip: number = 0;

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
        this.filters.push(filter);
    }

    public async getAll() {
        const results = [];
        for await (const res of await this.resolve()) {
            results.push(res);
        }
        return results;
    }

    public async getFirst() {
        for await (const res of await this.resolve()) {
            return res;
        }
    }

    public async *paginate(perPage: number = 20) {
        let page = [];
        for await (const res of await this.resolve()) {
            page.push(res);
            if (page.length === perPage) {
                yield page;
                page = [];
            }
        }
    }

    public async take(limit: number) {
        const results = [];
        for await (const res of await this.resolve()) {
            results.push(res);
            if (results.length === limit) break;
        }
        return results;
    }

    public async *iterate() {
        yield* this.resolve();
    }

    public conditionsToFilters() {
        let i = this.conditions.length;
        while (i--) {
            if (
                !Database.selectedDatabase.getTable(this.entityName).hasIndex(
                    this.conditions[i].condition.property
                )
            ) {
                this.addFilter(
                    this.conditions[i].condition.comparator.getFilter()
                );
                this.conditions.splice(i, 1);
            }
        }
    }

    private async *resolve() {
        this.conditionsToFilters();
        if (this.conditions.length === 0) {
            yield* this.noCondition();
        } else if (this.conditions.length === 1) {
            yield* this.singleCondition();
        } else {
            yield* this.multipleConditions();
        }
    }

    public async *noCondition() {
        const index = Database.selectedDatabase.getTable(this.entityName).getPrimaryIndex();

        for await (const result of await index.generatorTraverse()) {
            yield* this.filterAndSkip(result);
        }
    }

    public async *singleCondition() {
        const index = Database.selectedDatabase.getTable(this.entityName).getIndex(this.conditions[0].condition.property);

        for await (const result of await this.conditions[0].condition.comparator.traverse(
            index
        )) {
            yield* this.filterAndSkip(result);
        }
    }

    public async *multipleConditions() {
        for (const cond of this.conditions) {
            const index = Database.selectedDatabase.getTable(this.entityName).getIndex(cond.condition.property);

            for await (const result of await cond.condition.comparator.traverse(
                index
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

        for (const result of new Set([...andResults, ...orResults])) {
            yield* this.filterAndSkip(result);
        }
    }

    private async *filterAndSkip(result) {
        let item;
        if (this.filters.length > 0) {
            item = await DAG.GetAsync(result);
            for (const filter of this.filters) {
                if (!filter(item)) {
                    return;
                }
            }

            if (this.skip > 0) {
                this.skip = this.skip - 1;
                return;
            }

            yield item;
        } else {
            if (this.skip > 0) {
                this.skip = this.skip - 1;
                return;
            }

            yield await DAG.GetAsync(result);
        }
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
