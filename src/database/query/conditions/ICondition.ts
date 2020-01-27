import Where from "../condition";

export default interface ICondition<T> {
    first(indexCondition: Where<T>);
    test(value1: number, value2: number): Boolean;
}
