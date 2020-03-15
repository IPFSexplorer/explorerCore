import BaseQuery from "./baseQuery";
import PropertyCondition from "../conditions/propertyCondition";
import QueryPlanner from "../planners/queryPlanner";
import Database from "../database/databaseStore";
import JsonType from "serialazy/lib/dist/types/json_type";


export default class Queriable<T> extends BaseQuery<T> {
    constructor()
    {
        super();
        this.queryPlanner = new QueryPlanner(this.constructor.name);
    }

    public where(propertyNameOrNestedQuery): PropertyCondition
    {
        if (typeof propertyNameOrNestedQuery === "string")
        {
            const whereCondition = new PropertyCondition(
                propertyNameOrNestedQuery,
                this.queryPlanner
            );
            this.queryPlanner.addAndCondition(whereCondition);
            return whereCondition;
        }
    }

    public async save(): Promise<void>
    {
        return await Database.selectedDatabase.create(this);
    }

    // TODO remove toJson method and use serialazy
    public toJson(): JsonType
    {
        const res = {
        };
        for (const property in this)
        {
            res[property as string] = this[property];
        }
        return res;
    }
}
