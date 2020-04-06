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
    entry: string;

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
        return await this.where(IndexMap.getPrimary(this))
            .equal(
                IndexMap.getIndexes(this).indexes[
                    IndexMap.getPrimary(this)
                ].keyGetter(this),
            )
            .log();
    }

    public async save(): Promise<void> {
        await Database.selectedDatabase.create(this);
    }

    public async update(): Promise<void> {
        await Database.selectedDatabase.update(this);
    }

    public async delete(): Promise<void> {
        await Database.selectedDatabase.delete(this);
    }
}
