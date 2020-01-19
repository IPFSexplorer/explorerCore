import Index from "../index/index";
import Condition from "./condition";

export default class Queriable<T> {
    private entityName: string;
    private conditions: Condition<T>[] = [];
    private limitResult: number = -1;

    private selectFunction: (e: T) => Object;

    constructor(entityName: string) {
        this.entityName = entityName;
    }

    public is(propName: string) {
        const cond = new Condition<T>(propName, this);
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
        const { index, condition } = this.chooseIndex();
        return index.get<T>(condition, this.limitResult);
    }

    private chooseIndex(): { index: Index; condition: Condition<T> } {
        // get first match index
        for (const condition of this.conditions) {
            const indexName = this.entityName + "-" + condition.propertyName;
            if (Index.exists(indexName)) {
                return {
                    index: Index.getIndex(indexName),
                    condition: condition
                };
            }
        }

        // can not find any usefull index. Use default
        if (this.conditions.length > 0) {
            return {
                index: Index.getIndex(this.entityName),
                condition: this.conditions[0]
            };
        } else {
            const alwaysTrueCondition = new Condition<T>("", this);
            alwaysTrueCondition.gt(-Infinity);
            return {
                index: Index.getIndex(this.entityName),
                condition: alwaysTrueCondition
            };
        }
    }

    // [Symbol.iterator](): Iterator<T> {}

    // public and(query: Queriable<T>): Queriable<T> {}

    // public or(query: Queriable<T>): Queriable<T> {}
}
