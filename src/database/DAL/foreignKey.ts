import IndexMap from "./indexMap";
import Queriable from "./query/queriable";
import DAG from "../../ipfs/DAG";
import Database from "./database/databaseStore";
import { Serialize } from "serialazy";

export default class ForeignKey<T extends Queriable<any>> {
    @Serialize()
    private table: string;
    @Serialize()
    private primaryKey: any;
    private value: T;


    private async load(): Promise<T>
    {
        this.value = await Database.selectedDatabase.getTableByName(this.table).getPrimaryIndex().get(this.primaryKey);
        return this.value;
    }


    public async get(): Promise<T>
    {
        if (!this.value)
        {
            await this.load();
        }
        return this.value;
    }

    public set(entity: T)
    {
        this.table = entity.constructor.name;
        this.primaryKey = entity[IndexMap.getPrimary(entity)];
        this.value = entity;
    }
};