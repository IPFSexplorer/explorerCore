import Log from "../../log/log";
import DatabaseInstance from "./databaseInstance";
import { SortByEntryHash } from "../../log/log-sorting"
import Entry from "../../log/entry";
import { runInThisContext } from "vm";
import { Guid } from "guid-typescript";

export const DEFAULT_COMPARATOR = (a, b) => a < b;

export default class DBLog extends Log {
    private _head: string;
    private identity: any;

    constructor(identity, dbName) {
        super(identity, { logId: dbName, sortFn: SortByEntryHash })
        this.head = null
        this.identity = identity 
    }

    public merge(log: DBLog) {
        let thisHead: Entry = this.head
        let otherHead: Entry = log.head
        const rollbackOperations = []

        while (thisHead.clock.time > otherHead.clock.time) {
            if (Entry.verify(this.identity, thisHead))
                rollbackOperations.push(thisHead)
            thisHead = this.get(thisHead.payload.parent)
        }

        while (otherHead.clock.time > thisHead.clock.time)
            otherHead = log.get(otherHead.payload.parent)

        // now, thisHHead and otherHead should equal
        while (thisHead.payload.parent != otherHead.payload.parent) {
            if (Entry.verify(this.identity, thisHead))
                rollbackOperations.push(thisHead)
            otherHead = log.get(otherHead.payload.parent)
            thisHead = this.get(thisHead.payload.parent)
        }

        if (otherHead.hash > thisHead.hash) {
            this.head = log.head
            // TODO load DB from head
            
            rollbackOperations.reverse().forEach((e) =>
                this.add(
                    e.payload.transaction.operation,
                    e.payload.transaction.data,
                    Guid.create().toString())
            )
        }
    }



    public get head(): Entry {
        return this.get(this._head)
    }

    public set head(entry: Entry) {
        this._head = entry ? entry.hash : null
    }


    public async add(operation, data, dbHash) {
        const entry = await this.append({
            transaction: {
                operation: operation,
                data: data
            },
            database: dbHash,
            parent: this.head ? this.head.hash : null
        })
        this.head = entry
        return entry
    }
}