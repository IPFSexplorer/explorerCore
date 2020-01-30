import BaseQuery from "./baseQuery";
import PropertyCondition from "../conditions/propertyCondition";
import QueryPlanner from "../planners/queryPlanner";

export default class AfterConditionQuery<T> extends BaseQuery<T> {
    constructor(queryPlanner: QueryPlanner) {
        super();
        this.queryPlanner = queryPlanner;
    }

    public or(propertyNameOrNestedQuery): PropertyCondition {
        if (typeof propertyNameOrNestedQuery === "string") {
            const orCondition = new PropertyCondition(
                propertyNameOrNestedQuery,
                this.queryPlanner
            );
            this.queryPlanner.addOrCondition(orCondition);
            return orCondition;
        }
        // TODO handle nested
    }

    public and(propertyNameOrNestedQuery): PropertyCondition {
        if (typeof propertyNameOrNestedQuery === "string") {
            const andCondition = new PropertyCondition(
                propertyNameOrNestedQuery,
                this.queryPlanner
            );
            this.queryPlanner.addAndCondition(andCondition);
            return andCondition;
        }
        // TODO handle nested
    }
}
