import BaseQuery from "./baseQuery";
import PropertyCondition from "../conditions/propertyCondition";
import QueryPlanner from "../planners/queryPlanner";
import Database from "../database/database";

export default class DBentity<T> extends BaseQuery<T> {
    private entityName: string;

    constructor() {
        super();
        this.queryPlanner = new QueryPlanner(this.entityName);
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

    public async save(): Promise<void> {
        await Database.create(this.entityName, this);
    }
}
