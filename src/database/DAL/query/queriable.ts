import BaseQuery from "./baseQuery";
import PropertyCondition from "../conditions/propertyCondition";
import QueryPlanner from "../planners/queryPlanner";
import Database from "../database/databaseStore";
import JsonType from "serialazy/lib/dist/types/json_type";
import { Serialize } from "serialazy";
import IndexMap from "explorer-core/src/database/DAL/indexMap";


@Serialize.Type({
    down: (e: Queriable<any>) =>
    {
        return Object.getOwnPropertyNames(e);;
    },
    up: (e) => new Queriable(e as object)
})
export default class Queriable<T> extends BaseQuery<T> {
    constructor(init?: Partial<Queriable<T>>)
    {
        super();
        Object.assign(this, init);
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

    public async find(primaryKey: any): Promise<T> {
        return await this.where(IndexMap.getPrimary(this)).equal(primaryKey).first() as T
    }

    public async save(): Promise<void>
    {
        await Database.selectedDatabase.create(this);
    }

    public async update(): Promise<void>
    {
        await Database.selectedDatabase.update(this);
    }

    public async delete(): Promise<void>
    {
        await Database.selectedDatabase.delete(this);
    }
}
