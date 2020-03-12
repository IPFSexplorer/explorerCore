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
import PubSub from "../../../ipfs/PubSub";
import { delay } from "../../../common";

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
    public transactionsQueue: Queue;

    @Serialize() public databaseName: string;
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
            this.log = new DBLog(this.identity, this.databaseName);

            await this.startSubscribe();
            this.startBroadcast();
        }

        return this.log;
    }

    public async addToLog(operation, value = null, toBeginning = false)
    {
        console.log({ type: "ADD", operation, value });
        const queueFunction = toBeginning ? this.transactionsQueue.unshift : this.transactionsQueue.push;

        // TODO add reject on error
        return new Promise((resolve, reject) =>
        {
            queueFunction.call(this.transactionsQueue, async () =>
            {
                console.log({ type: "START", operation, value });
                console.time('TransactionRun');
                await this.runTransaction(new Transaction(operation, value));
                console.timeEnd('TransactionRun');
                console.log({ type: "FINISH", "queueLength": this.transactionsQueue.length, operation, value });
                resolve(
                    { operation, value }
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

        let entry;


        if (this.transactionsQueue.length <= 1) // if there is no other transaction
        {
            entry = await (await this.getOrCreateLog()).append({
                transaction: tx,
                database: await this.toMultihash(),
                parent: this.log.head ? this.log.head.hash : null
            });
            await PubSub.publish(this.databaseName, (await this.log.toMultihash()).toString());
        } else
        {
            entry = await (await this.getOrCreateLog()).append({
                transaction: tx,
                parent: this.log.head ? this.log.head.hash : null
            });
        }

        this.log.head = entry;
        return entry;
    }

    private async startSubscribe()
    {
        return await PubSub.subscribe(this.databaseName, (msg) =>
            this.syncLog(msg.data.toString())
        );
    }

    public async startBroadcast()
    {
        while (true)
        {
            if (this.transactionsQueue.length == 0) // if there is no other transaction
                await PubSub.publish(this.databaseName, (await this.log.toMultihash()).toString());
            await delay(5000);
        }
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
        console.log("Subscribing " + log);
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