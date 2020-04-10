import PropertyCondition from "../conditions/propertyCondition";
import { Filter } from "../query/types";
import DAG from "../../../ipfs/DAG";
import DatabaseInstance from "../database/databaseInstance";
import Database from "../database/databaseStore";
import Log from "../../log/log";
import Queriable from "../query/queriable";
import Entry from "../../log/entry";

enum ConditionTypes {
    And,
    Or,
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
    entity: Queriable<any>;

    constructor(entity: Queriable<any>) {
        this.entity = entity;
    }

    get entityName(): string {
        return this.entity.constructor.name;
    }

    get entityConstructor(): any {
        return this.entity.constructor;
    }

    public addAndCondition(condition: PropertyCondition) {
        this.conditions.push({
            condition,
            type: ConditionTypes.And,
            results: new Set(),
        });
    }

    public addOrCondition(condition: PropertyCondition) {
        this.conditions.push({
            condition,
            type: ConditionTypes.Or,
            results: new Set(),
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
        return await (await (await this.resolve())[Symbol.asyncIterator]().next()).value;
    }

    public async paginate(perPage: number = 20) {
        const iterator = await this.resolve()[Symbol.asyncIterator]();

        return {
            [Symbol.asyncIterator]: () => {
                let done = false;
                return {
                    next: async () => {
                        let page = [];
                        while (done || page.length === perPage) {
                            let res = await iterator.next();
                            if (!res.done) page.push(res.value);
                            else done = true;
                        }

                        return { value: page, done };
                    },
                };
            },
        };
    }

    public async take(limit: number) {
        const results = [];
        for await (const res of await this.resolve()) {
            results.push(res);
            if (results.length === limit) break;
        }
        return results;
    }

    public async iterate() {
        return await this.resolve();
    }

    public conditionsToFilters() {
        let i = this.conditions.length;
        while (i--) {
            if (
                !Database.selectedDatabase
                    .getTableByName(this.entityName)
                    .hasIndex(this.conditions[i].condition.property)
            ) {
                this.addFilter(this.conditions[i].condition.comparator.getFilter());
                this.conditions.splice(i, 1);
            }
        }
    }

    private async resolve() {
        this.entity.queryPlanner = null;
        return await (await Database.selectedDatabase.read(this.getGenerator.bind(this))) as  Promise<{
            [Symbol.asyncIterator]: () => {
                next: () => Promise<{
                    value: Promise<Queriable<any>>;
                    done: any;
                }>;
            };
        }>;
    }

    private async getGenerator() {
        this.conditionsToFilters();
        if (this.conditions.length === 0) {
            return await this.noCondition();
        } else if (this.conditions.length === 1) {
            return await this.singleCondition();
        } else {
            return await this.multipleConditions();
        }
    }

    public async noCondition() {
        const index = Database.selectedDatabase.getTableByName(this.entityName).getPrimaryIndex();

        const iterator = await index.generatorTraverse();
        return {
            [Symbol.asyncIterator]: () => {
                return this.nextFunction(iterator)
            },
        };
    }

    public async singleCondition() {
        const index = Database.selectedDatabase
            .getTableByName(this.entityName)
            .getIndex(this.conditions[0].condition.property);

        const iterator = await this.conditions[0].condition.comparator.traverse(index);
        return {
            [Symbol.asyncIterator]: () => {
                return this.nextFunction(iterator)
            },
        };
    }

    public async multipleConditions() {
        for (const cond of this.conditions) {
            const index = Database.selectedDatabase.getTableByName(this.entityName).getIndex(cond.condition.property);

            for await (const result of await cond.condition.comparator.traverse(index)) {
                cond.results.add(result);
            }
        }

        let andResults = this.intersection(this.conditions.filter((cond) => cond.type == ConditionTypes.And));
        let orResults = this.union(this.conditions.filter((cond) => cond.type == ConditionTypes.Or));

        const iterator = new Set([...andResults, ...orResults])[Symbol.iterator]();

        return {
            [Symbol.asyncIterator]: () => {
                return this.nextFunction(iterator)
            },
        };
    }

    private nextFunction (iterator : IterableIterator<any>) {
        return {
            next: async () => {
                const { value, done } = await iterator.next();
                return { value: done ? null : this.filterAndSkip(value), done };
            },
        };
    }

    private async filterAndSkip(result) {
        let item = this.resultMapper(result);
        if (this.filters.length > 0) {
            for (const filter of this.filters) {
                if (!filter(await item)) {
                    return;
                }
            }
        }

        if (this.skip > 0) {
            this.skip = this.skip - 1;
            return;
        }

        return item;
    }

    private async resultMapper(res: Promise<Entry>): Promise<Queriable<any>> {
        const entry = await Entry.fromMultihash(res);
        return new this.entityConstructor({
            ...entry.payload,
            entry: entry.hash,
        });
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
                          size: cond.results.size,
                      }
                    : min,
            {
                conditionIdx: 0,
                size: conditions[0].results.size,
            },
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
            })(),
        );
    }
}
