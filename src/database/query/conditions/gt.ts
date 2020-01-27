import Where from "../condition";
import ICondition from "./ICondition";

export default class ConditionGt<T> implements ICondition<T> {
    first(indexCondition: Where<T>) {
        throw new Error("Method not implemented.");
    }

    test(value1: number, value2: number): Boolean {
        return value1 >= value2;
    }
}
