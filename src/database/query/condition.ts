import Queriable from "./query";
import ICondition from "./conditions/ICondition";
import ConditionGt from "./conditions/gt";
import ConditionLt from "./conditions/ls";
import Index from "../index";

export default class Where<T> {
    propertyName: string;
    value: number;
    condition: ICondition<T>;
    private query: Queriable<T>;

    constructor(propName: string, query: Queriable<T>) {
        this.propertyName = propName;
        this.query = query;
    }

    getResults(index: Index) {
        return {
            [Symbol.iterator]: () => {
                let item = index.find(this.value);
                while (!this.condition.test(item))
                    return {
                        next: () => ({
                            value: this.getNext(),
                            done: false
                        })
                    };
            }
        };
    }

    private getNext() {}

    satisfy(result: T): Boolean {
        return this.condition.test(result[this.propertyName], this.value);
    }

    public gt(value: number) {
        this.condition = new ConditionGt<T>();
        this.value = value;
        return this.query;
    }

    public lt(value: number) {
        this.condition = new ConditionLt<T>();
        this.value = value;
        return this.query;
    }
}
