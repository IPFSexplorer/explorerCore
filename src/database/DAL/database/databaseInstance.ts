import Table from "../tables/table";
import DBLog from "./DBLog";
import Queriable from "../query/queriable";
import IdentityProvider from "orbit-db-identity-provider";
import { DbOperation } from "./DBOperations";
import Log from "../../log/log";
import { deflate, inflate, Serialize } from 'serialazy';
import SerializeAnObjectOf from "../../serialization/objectSerializer";
import { JsonMap } from "serialazy/lib/dist/types/json_type";
import { write, read } from "../../log/io";
import Queue from "queue";
import Transaction from "./transactions/transaction";

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
    private transactionsQueue: Queue;


    // only local operation used when we want to fast apply migrations
    private localLog: Log;
    private time: number;
    @Serialize() public databaseName: string;
    public userName: string;
    public identity: any;

    constructor()
    {
        this.transactionsQueue = new Queue({
            concurrency: 1,
            autostart: true
        });
    }

    public async getOrCreateLog()
    {
        if (!this.log)
        {
            this.identity = await IdentityProvider.createIdentity({ id: this.userName });
            this.log = new DBLog(this.identity, this.databaseName);
        }

        return this.log;
    }

    public async addToLog(operation, value = null, toBeginning = false)
    {

        const queueFunction = toBeginning ? this.transactionsQueue.unshift : this.transactionsQueue.push;

        // TODO add reject on error
        return new Promise((resolve, reject) =>
        {
            queueFunction.call(this.transactionsQueue, async () =>
            {
                resolve(
                    await this.runTransaction(new Transaction(operation, value))
                );
            });
        });

    }


    public async runTransaction(tx: Transaction)
    {
        switch (tx.operation)
        {
            case DbOperation.Create:
                await this
                    .getOrCreateTableByEntity(tx.data as Queriable<any>)
                    .insert(tx.data as Queriable<any>);
                break;

            case DbOperation.Delete:

                break;

            case DbOperation.Update:

                break;

            case DbOperation.Merge:
                await this.log.merge(tx.data as DBLog);
                return;


            default:
                throw Error(`wrong db operation ${tx.operation}`);
        }

        const entry = await (await this.getOrCreateLog()).append({
            transaction: tx,
            database: await this.toMultihash(),
            parent: this.log.head ? this.log.head.hash : null
        });

        this.log.head = entry;
        return entry;
    }

    public async create(entity: Queriable<any>)
    {
        await this.addToLog(DbOperation.Create, entity);
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
            const table = new Table();
            table.init(entity.__TABLE_NAME__,
                entity.__INDEXES__.indexes,
                entity.__INDEXES__.primary);
            this.tables[entity.__TABLE_NAME__] = table;
        }

        return this.getTableByEntity(entity);
    }

    public async toMultihash()
    {
        const res = {};
        Object.keys(this.tables).forEach(k => res[k] = deflate(this.tables[k]));
        return await write("dag-json", res);
    }


    public async fromMultihash(cid)
    {
        const tables = await read(cid, {});
        this.tables = {};

        Object.keys(tables).forEach(k => this.tables[k] = inflate(Table, tables[k]));
        return;
    }

    public getLog()
    {
        if (this.log)
        {
            return this.log.toMultihash();
        }
    }

    public async syncLog(log)
    {
        await this.addToLog(DbOperation.Merge, await DBLog.fromMultihash(this.identity, this.databaseName, log), true);
    }

    public async waitForAllTransactionsDone()
    {
        return new Promise((resolve, reject) =>
        {
            this.transactionsQueue.start(error =>
            {
                if (error)
                {
                    reject(error);
                } else
                {
                    resolve();
                }
            });
        });
    }
}