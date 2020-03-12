import Log from "../../log/log";
import LamportClock from "../../log/lamport-clock";
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
import PubSub from "../../../ipfs/PubSub";

export const DEFAULT_COMPARATOR = (a, b) => a < b;

export default class DBLog extends Log
{
    private _head: string;
    private identity: any;


    constructor(identity, dbName,
        { access = undefined, entries = undefined, heads = undefined, clock = undefined, concurrency = undefined, head = null } = {})
    {
        super(identity, { logId: dbName, sortFn: SortByEntryHash, access, entries, heads, clock, concurrency });
        this._head = head;
        this.identity = identity;
    }

    public async merge(log: DBLog)
    {
        let thisHead: Entry = this.head;
        let otherHead: Entry = log.head;
        const rollbackOperations = [];

        while (thisHead.clock.time > otherHead.clock.time)
        {
            if (thisHead.identity.id === this.identity.id)
                rollbackOperations.push(thisHead);
            thisHead = this.get(thisHead.payload.parent);
        }

        while (otherHead.clock.time > thisHead.clock.time)
            otherHead = log.get(otherHead.payload.parent);

        // now, this.Head and otherHead should equal
        while (thisHead.payload.parent != otherHead.payload.parent)
        {
            if (Entry.verify(this.identity.provider, thisHead))
                rollbackOperations.push(thisHead);
            otherHead = log.get(otherHead.payload.parent);
            thisHead = this.get(thisHead.payload.parent);
        }

        if (otherHead.hash > thisHead.hash)
        {
            rollbackOperations.push(thisHead);
            await Database.databaseByName(this.id).fromMultihash(log.head.payload.database);

            rollbackOperations.forEach((e) =>
                Database.databaseByName(this.id).addToLog(
                    e.payload.transaction.operation,
                    e.payload.transaction.data,
                    true)
            );
            this._head = log.head.hash;
            await this.join(log);
            this._clock = new LamportClock(this.clock.id, this.head.clock.time);
            if (Database.databaseByName(this.id).transactionsQueue.length <= 1) // if there is no other transaction
                await PubSub.publish(this.id, (await this.toMultihash()).toString());
        }

        await this.join(log);
        if (this.head.clock.time < log.head.clock.time)
            this._head = log.head.hash;
        this._clock = new LamportClock(this.clock.id, this.head.clock.time);
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
}