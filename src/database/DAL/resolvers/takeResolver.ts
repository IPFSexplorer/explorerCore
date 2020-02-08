import ResolverBase from "./resolverBase";
import QueryPlanner from "../planners/queryPlanner";
import store from "@/store";

export default class TakeResolver extends ResolverBase {
    constructor(queryPlanner: QueryPlanner, limit: number) {
        super(queryPlanner);
    }

    public async resolve() {
        const results = await this.queryPlanner.execute();
        store.dispatch("setQueryResult", results);
        return results;
    }
}
