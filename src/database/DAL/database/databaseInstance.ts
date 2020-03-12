import Table from "../tables/table";
import DBLog from "./log/DBLog";
import Queriable from "../query/queriable";
import { DbOperation } from "./DBOperations";
import { deflate, inflate, Serialize } from 'serialazy';
import SerializeAnObjectOf from "../../serialization/objectSerializer";
import { JsonMap } from "serialazy/lib/dist/types/json_type";
import { write, read } from "../../log/io";
import Queue from "queue";
import Transaction from "./transactions/Transaction";
import PubSub from "../../../ipfs/PubSub";
import PubSubMessage from "./PubSub/pubSubMessage";
import PubSubListener from "./PubSub/PubSub";
import DBAccessController from "./AccessController/AccessController";
import { PubSubMessageType } from "./PubSub/MessageType";
import ITransaction from "./transactions/ITransaction";
import Entry from "../../log/entry";
import { DBLogPayload } from "./log/DBLogPayload";
import BTree from "explorer-core/src/database/BTree/BTree";

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
    log: DBLog;
    transactionsQueue: Queue;

    @Serialize() databaseName: string;
    identity: any;
    pubSubListener: PubSubListener;
    accessController: DBAccessController;

    constructor(init?: Partial<DatabaseInstance>)
    {
        Object.assign(this, init);
        this.transactionsQueue = new Queue({
            concurrency: 1,
            autostart: true
        });
        this.pubSubListener = new PubSubListener(this.databaseName);
        this.pubSubListener.start();

        this.accessController = new DBAccessController(this.databaseName);


    }

    public async getOrCreateLog()
    {
        if (!this.log)
        {
            this.log = new DBLog(this.identity, this.databaseName);
        }

        return this.log;
    }

    public async addTransaction(transaction: ITransaction, toBeginning = false)
    {
        const queueFunction = toBeginning ? this.transactionsQueue.unshift : this.transactionsQueue.push;

        // TODO add reject on error
        return new Promise((resolve, reject) =>
        {
            queueFunction.call(this.transactionsQueue, async () =>
            {
                resolve(await this.runTransaction(transaction));
            });
        });

    }

    public async runTransaction(tx: ITransaction)
    {
        // do not add entry to the log for merge transaction
        if (await tx.run(this))
        {
            let entry: Entry;
            if (this.transactionsQueue.length <= 1) // if there is no other transaction
            {
                entry = await (await this.getOrCreateLog()).append({
                    transaction: tx,
                    database: await this.toMultihash(),
                    parent: this.log.head ? this.log.head.hash : null,
                    grantAccessTo: this.accessController.getFirst()
                } as DBLogPayload);
                await this.pubSubListener.publish(new PubSubMessage({
                    type: PubSubMessageType.PublishVersion,
                    value: (await this.log.toMultihash()).toString()
                }));

                this.accessController.returnTicket();
                console.log(entry);
            } else
            {
                entry = await (await this.getOrCreateLog()).append({
                    transaction: tx,
                    parent: this.log.head ? this.log.head.hash : null
                } as DBLogPayload);
            }

            this.log.head = entry;
            return entry;
        }
    }

    public async create(entity: Queriable<any>)
    {
        const tx = new Transaction({ operation: DbOperation.Create, data: entity });
        await this.addTransaction(tx);
    }

    public update(table, address, newData)
    {

    }

    public remove(table, data)
    {

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
            let indexes: { [property: string]: BTree<any, any>; } = {};
            Object.keys(entity.__INDEXES__.indexes).map(k => indexes[k] = new BTree(
                entity.__INDEXES__.indexes[k].branching,
                entity.__INDEXES__.indexes[k].comparator,
                entity.__INDEXES__.indexes[k].keyGetter
            ));

            this.tables[entity.__TABLE_NAME__] = new Table({
                name: entity.__TABLE_NAME__,
                primaryIndex: entity.__INDEXES__.primary,
                indexes: indexes,

            });
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

    public async publishLog(force = false)
    {
        if (this.transactionsQueue.length <= 1 || force) // if there is no other transaction
            await this.pubSubListener.publish(
                new PubSubMessage(
                    {
                        type: PubSubMessageType.PublishVersion,
                        value: (await this.log.toMultihash()).toString()
                    }
                )
            );
    }


    public async syncLog(hash: string)
    {
        // // start merging

        // this.transactionsQueue.stop();
        // this.transactionsQueue.on("end", () =>
        // {

        // });
        // this.transactionsQueue.stop();

        const tx = new Transaction({
            operation: DbOperation.Merge,
            data: hash
        });
        await this.addTransaction(tx, true);
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