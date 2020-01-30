import ResolverBase from "./resolverBase";
import QueryPlanner from "../planners/queryPlanner";

export default class AllResolver extends ResolverBase {
    constructor(queryPlanner: QueryPlanner) {
        super(queryPlanner);
    }

    public resolve() {
        const results = this.queryPlanner.execute();
        return results;
    }
}
