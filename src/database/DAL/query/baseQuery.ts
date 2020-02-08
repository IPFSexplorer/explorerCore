import IndexStore from "../indexes/indexStore";
import AllResolver from "../resolvers/allResolver";
import QueryPlanner from "../planners/queryPlanner";
import FirstResolver from '../resolvers/FirstResolver';
import TakeResolver from '../resolvers/takeResolver';

export default class BaseQuery<T> {
    protected queryPlanner: QueryPlanner;

    public async all() {
        return await new AllResolver(this.queryPlanner).resolve();
    }

    public async first() {
        return await new FirstResolver(this.queryPlanner).resolve();
    }

    public async take(limit: number) {
        return await new TakeResolver(this.queryPlanner, limit).resolve();
    }
}
