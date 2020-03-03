import BaseQuery from "./baseQuery";
import PropertyCondition from "../conditions/propertyCondition";
import QueryPlanner from "../planners/queryPlanner";
import DatabaseInstance from "../database/databaseInstance";
import Database from "../database/databaseStore";

export default class Queriable<T> extends BaseQuery<T> {
    private entityName: string;
    protected __DATABASE_NAME__: string;

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
        await Database.selectedDatabase.create(this.entityName, this);
    }
}
