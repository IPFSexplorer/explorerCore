import Queriable from "./query";

enum ConditionType {
    GT,
    LT,
    EQ
}

export default class Condition<T> {
    propertyName: string;
    value: number;
    type: ConditionType;
    private query: Queriable<T>;

    constructor(propName: string, query: Queriable<T>) {
        this.propertyName = propName;
        this.query = query;
    }

    public gt(value: number) {
        this.type = ConditionType.GT;
        this.value = value;
        return this.query;
    }
}
