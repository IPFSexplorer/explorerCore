import Table from "../tables/table";
import DBLog from "./DBLog";
import Queriable from "../query/queriable";
import IdentityProvider from "orbit-db-identity-provider";
import { DbOperation } from "./DBOperations";
import Log from "../../log/log";
import { deflate, inflate, Serialize } from 'serialazy';
import { Guid } from "guid-typescript";
import SerializeAnObjectOf from "../../serialization/objectSerializer";
import { JsonMap } from "serialazy/lib/dist/types/json_type";


export default class DatabaseInstance
{
    @SerializeAnObjectOf(Table)
    private tables: { [property: string]: Table; } = {};

    @Serialize.Custom({
        down: (log: DBLog) =>
        {
            if (!log) { return; }
            return log.toJSON() as JsonMap;
        },
        up: (logObj) =>
        {
            // We will unserialize this later in FromJson function because this needs to be async
            return logObj as unknown;
        }
    }, { optional: true })
    public log: DBLog;


    // only local operation used when we want to fast apply migrations
    private localLog: Log;
    private time: number;
    @Serialize() public databaseName: string;
    public userName: string;
    private identity: any;

    constructor()
    {
    }

    public async getOrCreateLog()
    {
        if (!this.log)
        {
            this.identity = await IdentityProvider.createIdentity({ id: this.userName });
            this.log = new DBLog(this.identity, this.databaseName);
            await this.addToLog(DbOperation.Init);
        }

        return this.log;
    }

    private async addToLog(operation, value = null, toBeginning = false)
    {
        await (await this.getOrCreateLog()).add(operation, value, toBeginning);
    }

    public async create(entity: Queriable<any>)
    {
        return await this.addToLog(DbOperation.Create, entity);
    }

    public update(table, address, newData)
    {

    }

    public remove(table, data)
    {

    }


    public tableExists(tableName: string): boolean
    {
        return this.tables.hasOwnProperty(tableName);
    }

    public getTableByName(tableName: string): Table
    {
        if (this.tables.hasOwnProperty(tableName))
            return this.tables[tableName];
        else return null;
    }


    public getTableByEntity(entity: Queriable<any>): Table
    {
        if (this.tables.hasOwnProperty(entity.__TABLE_NAME__))
            return this.tables[entity.__TABLE_NAME__];
        else return null;
    }

    public getOrCreateTableByEntity(entity: Queriable<any>): Table
    {
        if (!this.getTableByEntity(entity))
        {
            this.tables[entity.__TABLE_NAME__] = new Table(
                entity.__TABLE_NAME__,
                entity.__INDEXES__.indexes,
                entity.__INDEXES__.primary
            );
        }

        return this.getTableByEntity(entity);
    }

    public publishDatabase()
    {
        return Guid.create();
        // TODO save database to IPFS and returns only CID
        // return {
        //     tables: this.tables,
        //     databaseName: this.databaseName
        // };
    }

    public getLog()
    {
        return this.log.toMultihash();
    }

    public async syncLog(log)
    {
        await this.addToLog(DbOperation.Merge, await DBLog.fromMultihash(this.identity, this.databaseName, log), true);
    }
}