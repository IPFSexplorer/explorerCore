import BaseQuery from "./baseQuery";
import PropertyCondition from "../conditions/propertyCondition";
import Database from "../database/databaseStore";
import { Serialize } from "serialazy";
import IndexMap from "../indexMap";
import Log from "../../log/log";

@Serialize.Type({
    down: (e: Queriable<any>) => {
        return Object.getOwnPropertyNames(e);
    },
    up: (e) => new Queriable(e as object),
})
export default class Queriable<T> extends BaseQuery<T> {
    entryHash: string;

    constructor(init?: Partial<Queriable<T>>) {
        super();
        Object.assign(this, init);
    }

    public where(propertyNameOrNestedQuery): PropertyCondition {
        if (typeof propertyNameOrNestedQuery === "string") {
            const whereCondition = new PropertyCondition(
                propertyNameOrNestedQuery,
                this.queryPlanner,
            );
            this.queryPlanner.addAndCondition(whereCondition);
            return whereCondition;
        }
    }

    public async find(primaryKey: any): Promise<T> {
        return (await this.where(IndexMap.getPrimary(this))
            .equal(primaryKey)
            .first()) as T;
    }

    public async history(): Promise<Log> {
        return await Log.fromEntryHash(Database.selectedDatabase.identity, this.entryHash)
    }

    public async save(): Promise<void> {
        this.queryPlanner = null
        this.entryHash = await Database.selectedDatabase.create(this) as string;
    }

    public async update(): Promise<void> {
        this.queryPlanner = null
        this.entryHash = await Database.selectedDatabase.update(this) as string;;
    }

    public async delete(): Promise<void> {
        await Database.selectedDatabase.delete(this);
        this.entryHash = null
    }
}
