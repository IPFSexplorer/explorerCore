import PropertyCondition from "../conditions/propertyCondition";
import IndexStore from "../indexes/indexStore";
import { Filter } from "../query/types";
import DAG from "@/ipfs/DAG";

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

    private async *resolve() {
        if (this.conditions.length > 1) {
            yield* this.multipleConditions();
        } else {
            yield* this.singleOrNoCondition();
        }
    }

    public async *singleOrNoCondition() {
        const btree =
            this.conditions.length === 0
                ? IndexStore.getPrimaryIndex(this.entityName)
                : IndexStore.getIndex(
                    this.entityName,
                    this.conditions[0].condition.property
                );

        for await (const result of await this.conditions[0].condition.comparator.traverse(
            btree
        )) {
            yield* this.filterAndSkip(result);
        }

    }

    public async *multipleConditions() {
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
