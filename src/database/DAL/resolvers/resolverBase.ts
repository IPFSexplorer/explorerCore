import QueryPlanner from "../planners/queryPlanner";

export default abstract class ResolverBase {
    queryPlanner: QueryPlanner;
    constructor(queryPlanner: QueryPlanner) {
        this.queryPlanner = queryPlanner;
    }
    public abstract resolve();
}
