import Index from "../index/index";
import Where from "./condition";

export default class Queriable<T> {
    private entityName: string;
    private conditions: Where<T>[] = [];
    private limitResult: number = -1;

    private selectFunction: (e: T) => Object;

    constructor(entityName: string) {
        this.entityName = entityName;
    }

    public where(propName: string) {
        const cond = new Where<T>(propName, this);
        this.conditions.push(cond);
        return cond;
    }

    public select(select: (e: T) => Object): Queriable<any> {
        this.selectFunction = select;
        return this;
    }

    public all(): T[] {
        return this.resolve();
    }

    public first(): T {
        this.limit(1);
        return this.all()[0]; //TODO check if exist
    }

    public limit(limit: number): Queriable<T> {
        this.limitResult = limit;
        return this;
    }

    protected resolve(): T[] {
        const { index, conditionIdx } = this.chooseIndex();

        let indexCondition: Where<T>;
        if (conditionIdx >= 0) {
            indexCondition = this.conditions.splice(conditionIdx, 1)[0];
        } else {
            indexCondition = new Where<T>("", this);
            indexCondition.gt(-Infinity);
        }

        for (const result of indexCondition.getResults(index)) {
            this.test(result);
        }
    }

    private test(result: T) {
        for (const condition of this.conditions) {
            if (!condition.satisfy(result)) return false;
        }
        return true;
    }

    private chooseIndex(): { index: Index; conditionIdx: number } {
        // get first match index
        for (let index = 0; index < this.conditions.length; index++) {
            const indexName =
                this.entityName + "-" + this.conditions[index].propertyName;
            if (Index.exists(indexName)) {
                return {
                    index: Index.getIndex(indexName),
                    conditionIdx: index
                };
            }
        }

        // can not find any usefull index. Use default
        return {
            index: Index.getIndex(this.entityName),
            conditionIdx: -1
        };
    }

    // [Symbol.iterator](): Iterator<T> {}

    // public and(query: Queriable<T>): Queriable<T> {}

    // public or(query: Queriable<T>): Queriable<T> {}
}
