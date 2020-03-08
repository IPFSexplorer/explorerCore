import Log from "../../log/log";
import DatabaseInstance from "./databaseInstance";
import { SortByEntryHash } from "../../log/log-sorting";
import Entry from "../../log/entry";
import { runInThisContext } from "vm";
import { Guid } from "guid-typescript";
import LogIO from "../../log/log-io";
import Queue from "queue";
import Transaction from "./transactions/transaction";
import { DbOperation } from "./DBOperations";
import Queriable from "../query/queriable";
import Database from "./databaseStore";

export const DEFAULT_COMPARATOR = (a, b) => a < b;

export default class DBLog extends Log
{
    private _head: string;
    private identity: any;
    private transactionsQueue: Queue;

    constructor(identity, dbName,
        { access = undefined, entries = undefined, heads = undefined, clock = undefined, concurrency = undefined, head = null } = {})
    {
        super(identity, { logId: dbName, sortFn: SortByEntryHash, access, entries, heads, clock, concurrency });
        this._head = head;
        this.identity = identity;
        this.transactionsQueue = new Queue({
            concurrency: 1,
            autostart: true
        });
    }

    public async merge(log: DBLog)
    {
        let thisHead: Entry = this.head;
        let otherHead: Entry = log.head;
        const rollbackOperations = [];

        while (thisHead.clock.time > otherHead.clock.time)
        {
            if (Entry.verify(this.identity, thisHead))
                rollbackOperations.push(thisHead);
            thisHead = this.get(thisHead.payload.parent);
        }

        while (otherHead.clock.time > thisHead.clock.time)
            otherHead = log.get(otherHead.payload.parent);

        // now, thisHHead and otherHead should equal
        while (thisHead.payload.parent != otherHead.payload.parent)
        {
            if (Entry.verify(this.identity, thisHead))
                rollbackOperations.push(thisHead);
            otherHead = log.get(otherHead.payload.parent);
            thisHead = this.get(thisHead.payload.parent);
        }

        if (otherHead.hash > thisHead.hash)
        {
            this.head = log.head;
            // TODO load DB from head

            rollbackOperations.reverse().forEach((e) =>
                this.add(
                    e.payload.transaction.operation,
                    e.payload.transaction.data,
                    true)
            );
        }

        await this.join(log);
        return;
    }

    public toJSON()
    {
        return {
            head: this._head,
            ... super.toJSON()
        };
    }

    public static async fromMultihash(
        identity: any,
        databaseName: string,
        hash: any,
        {
            access = undefined,
            length = -1,
            exclude = [],
            timeout = undefined,
            concurrency = undefined,
            sortFn = undefined,
            onProgressCallback = undefined
        } = {}
    )
    {
        // TODO: need to verify the entries with 'key'
        const { logId, entries, heads, head } = await LogIO.fromMultihash(
            hash,
            {
                length,
                exclude,
                timeout,
                onProgressCallback,
                concurrency,
                sortFn
            }
        );
        return new DBLog(identity, databaseName, {
            access,
            entries,
            heads,
            head
        });
    }


    public get head(): Entry
    {
        return this.get(this._head);
    }

    public set head(entry: Entry)
    {
        this._head = entry ? entry.hash : null;
    }


    public async add(operation, data, toBeginning = false)
    {
        const logFunction = toBeginning ? this.transactionsQueue.unshift : this.transactionsQueue.push;

        // TODO add reject on error
        return new Promise((resolve, reject) =>
        {
            logFunction(async () =>
            {
                resolve(
                    await this.runTransaction(new Transaction(operation, data))
                );
            });
        });
    }

    private async runTransaction(tx: Transaction)
    {
        const database = Database.databaseByName(this.id);

        switch (tx.operation)
        {
            case DbOperation.Create:
                await database
                    .getOrCreateTableByEntity(tx.data as Queriable<any>)
                    .insert(tx.data as Queriable<any>);
                break;

            case DbOperation.Delete:

                break;

            case DbOperation.Update:

                break;

            case DbOperation.Init:
                break;

            case DbOperation.Merge:
                await this.merge(tx.data as DBLog);
                break;


            default:
                throw Error(`wrong db operation ${tx.operation}`);
        }

        const entry = await this.append({
            transaction: tx,
            database: database.publishDatabase(),
            parent: this.head ? this.head.hash : null
        });

        this.head = entry;
        return entry;
    }
}