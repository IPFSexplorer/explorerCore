import IndexStore from "../indexes/indexStore";
import AllResolver from "../resolvers/allResolver";
import QueryPlanner from "../planners/queryPlanner";

export default class BaseQuery<T> {
    protected queryPlanner: QueryPlanner;

    // [Symbol.iterator](): Iterator<T> {}
    // public select(select: (e: T) => Object): Queriable<any> {}
    public async all() {
        return await new AllResolver(this.queryPlanner).resolve();
    }
    // public first(): T {}
    // public limit(limit: number): Queriable<T> {}
}
