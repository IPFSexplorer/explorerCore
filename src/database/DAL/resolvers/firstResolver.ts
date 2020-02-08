import ResolverBase from "./resolverBase";
import QueryPlanner from "../planners/queryPlanner";
import store from "@/store";

export default class FirstResolver extends ResolverBase {
    constructor(queryPlanner: QueryPlanner) {
        super(queryPlanner);
    }

    public async resolve() {
        const results = await this.queryPlanner.execute();
        store.dispatch("setQueryResult", results);
        return results;
    }
}
