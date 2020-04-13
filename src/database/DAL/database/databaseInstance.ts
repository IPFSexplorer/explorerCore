import Table from "../tables/table";
import DBLog from "./log/DBLog";
import Queriable from "../query/queriable";
import { DbOperation } from "./DBOperations";
import { deflate, inflate, Serialize } from "serialazy";
import SerializeAnObjectOf from "../../serialization/objectSerializer";
import { JsonMap } from "serialazy/lib/dist/types/json_type";
import { write, read } from "../../log/io";
import Queue from "queue";
import LoggedTransaction from "./transactions/LoggedTransaction";
import PubSub from "../../../ipfs/PubSub";
import PubSubMessage from "./PubSub/pubSubMessage";
import PubSubListener from "./PubSub/PubSub";
import DBAccessController from "./AccessController/AccessController";
import { PubSubMessageType } from "./PubSub/MessageType";
import ITransaction from "./transactions/ITransaction";
import Entry from "../../log/entry";
import { DBLogPayload } from "./log/DBLogPayload";
import BTree from "../../BTree/BTree";
import AsyncLock from "async-lock";
import IndexMap from "../indexMap";
import DAG from "../../../ipfs/DAG";
import ReadTransaction from "./transactions/ReadTransaction";
import logger from "../../../logger";
import { DbOptions, DbSyncStrategy } from "./DbConnectOptions";

export default class DatabaseInstance {
    @SerializeAnObjectOf(Table)
    private tables: { [property: string]: Table } = {};

    @Serialize.Custom(
        {
            down: (log: DBLog) => {
                if (!log) {
                    return;
                }
                return (log.toJSON() as any) as JsonMap;
            },
            up: (logObj) => {
                // We will unserialize this later in FromJson function because this needs to be async
                return logObj as unknown;
            },
        },
        { optional: true },
    )
    log: DBLog;
    transactionsQueue: Queue;

    @Serialize() databaseName: string;
    identity: any;
    pubSubListener: PubSubListener;
    accessController: DBAccessController;
    private _lock: any;
    private _dbHash: string;
    public options: DbOptions

    constructor(init?: Partial<DatabaseInstance>) {
        Object.assign(this, init);
        this._lock = new AsyncLock();

        this.log = new DBLog(this.identity, this.databaseName);
        this.transactionsQueue = new Queue({
            concurrency: 1,
            autostart: true,
        });
        this.pubSubListener = new PubSubListener(this.databaseName);
        this.pubSubListener.start();

        this.accessController = new DBAccessController(this.databaseName);
    }

    public async processTransaction(transaction: ITransaction, toBeginning = false) {
        const queueFunction = toBeginning ? this.transactionsQueue.unshift : this.transactionsQueue.push;

        // TODO add reject on error
        return new Promise((resolve, reject) => {
            queueFunction.call(this.transactionsQueue, async () => {
                resolve(await transaction.run(this));
            });
        });
    }

    public async create(entity: Queriable<any>, cid) {
        const tx = new LoggedTransaction({
            operation: DbOperation.Create,
            data: { entity, cid },
        });
        return await this.processTransaction(tx);
    }

    public async read(query) {
        const tx = new ReadTransaction(query);
        return await this.processTransaction(tx);
    }

    public async update(entity: Queriable<any>, cid) {
        const tx = new LoggedTransaction({
            operation: DbOperation.Update,
            data: { entity, cid },
        });
        return await this.processTransaction(tx);
    }

    public async delete(entity: Queriable<any>) {
        const tx = new LoggedTransaction({
            operation: DbOperation.Delete,
            data: entity,
        });
        return await this.processTransaction(tx);
    }

    public getTableByName(tableName: string): Table {
        if (this.tables.hasOwnProperty(tableName)) return this.tables[tableName];
        else return null;
    }

    public getTableByEntity(entity: Queriable<any>): Table {
        if (this.tables.hasOwnProperty(entity.constructor.name)) return this.tables[entity.constructor.name];
        else return null;
    }

    public getOrCreateTableByEntity(entity: Queriable<any>): Table {
        if (!this.getTableByEntity(entity)) {
            const indexes = {};

            for (const property in IndexMap.getIndexes(entity).indexes) {
                indexes[property] = new BTree(
                    IndexMap.getIndexes(entity).indexes[property].branching,
                    IndexMap.getIndexes(entity).indexes[property].comparator,
                    IndexMap.getIndexes(entity).indexes[property].keyGetter,
                );
            }

            this.tables[entity.constructor.name] = new Table({
                name: entity.constructor.name,
                primaryIndex: IndexMap.getPrimary(entity),
                indexes: indexes,
            });
        }

        return this.getTableByEntity(entity);
    }

    public async toMultihash() {
        const res = {};
        Object.keys(this.tables).forEach((k) => (res[k] = deflate(this.tables[k])));
        return await DAG.PutAsync(res);
    }

    public async fromMultihash(cid) {
        const tables = await read(cid, {});
        this.tables = {};

        Object.keys(tables).forEach((k) => (this.tables[k] = inflate(Table, tables[k])));
        return;
    }

    async lock(fn) {
        return await this._lock.acquire(this.databaseName, async (done) => {
            done(null, await fn());
        });
    }

    public async syncLog(hash: string) {
        if (this._dbHash === hash) {
            return;
        }

        await this.lock(async () => {
            switch (this.options.syncStrategy) {
                case DbSyncStrategy.migrate:
                    try {
                        const dbLog = await DBLog.fromMultihash(this.identity, this.databaseName, hash);
                        await this.log.merge(dbLog);
                        this._dbHash = hash;
                    } catch (e) {
                        console.log(e);
                        logger.error(e.toString());
                    }
                    break;
                case DbSyncStrategy.replace:
                    const tables = await DAG.GetAsync(hash + "/head/payload/database")
                    this.tables = {};
                    console.log(tables)

                    Object.keys(tables).forEach((k) => (this.tables[k] = inflate(Table, tables[k])));
                default:
                    break;
            }
        });

        return;
    }

    public async waitForAllTransactionsDone() {
        return new Promise((resolve, reject) => {
            this.transactionsQueue.start((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}
