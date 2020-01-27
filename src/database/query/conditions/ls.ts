import Where from "../condition";
import ICondition from "./ICondition";

export default class ConditionLt<T> implements ICondition<T> {
    first(indexCondition: Where<T>) {
        throw new Error("Method not implemented.");
    }
    test(object: T, property: string, value: number): Boolean {
        return object[property] <= value;
    }
}
