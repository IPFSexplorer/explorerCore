import BaseQuery from "./baseQuery";
import PropertyCondition from "../conditions/propertyCondition";
import QueryPlanner from "../planners/queryPlanner";

export default class Queriable<T> extends BaseQuery<T> {
    private entityName: string;

    constructor(entityName: string) {
        super();
        this.entityName = entityName;
        this.queryPlanner = new QueryPlanner(entityName);
    }

    public where(propertyNameOrNestedQuery): PropertyCondition {
        if (typeof propertyNameOrNestedQuery === "string") {
            const whereCondition = new PropertyCondition(
                propertyNameOrNestedQuery,
                this.queryPlanner
            );
            this.queryPlanner.addAndCondition(whereCondition);
            return whereCondition;
        }
        // TODO handle nested
    }
}
