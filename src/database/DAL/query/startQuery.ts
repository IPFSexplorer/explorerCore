import BaseQuery from "./baseQuery";
import PropertyCondition from "../conditions/propertyCondition";
import QueryPlanner from "../planners/queryPlanner";
import { Filter } from './types';

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
    }

    public filter(filter: Filter<T>) {
        this.queryPlanner.addFilter(filter)
    }
}
