import Log from "../../log/log";
import DatabaseInstance from "./database";
import { SortByEntryHash } from "../../log/log-sorting"

export const DEFAULT_COMPARATOR = (a, b) => a < b;

export default class DBLog extends Log {

    constructor(identity, dbName) {
        super(identity, { logId: dbName, sortFn: SortByEntryHash})
    }

    public merge(log: DBLog) {
        let needToGoBackToTime = this.clock.time
        const newItems = Log.difference(log, this)
        for (const hash in newItems) {
            const entry = log.get(hash)
            const entriesInTime = this.getInTime(entry.clock.time)
            if (entriesInTime.findIndex((e) => DEFAULT_COMPARATOR(e.hash, hash)) > -1) {
                if (entry.clock.time < needToGoBackToTime)
                    needToGoBackToTime = entry.clock.time
            }
        }

        // TODO load DB in time equal to "needToGoBackToTime" and apply all migrations
        return needToGoBackToTime

    }

    public getAppliedEntryInTime(time: number) {
        return this.getInTime(time).reduce((max, current) =>
            DEFAULT_COMPARATOR(current.hash, max.hash) ? max : current)
    }

    public getAppliedDBchain() {
        const results = []
        for (let time = 1; time <= this.clock.time; time++) {
            results.push(this.getAppliedEntryInTime(time))
        }
        return results
    }

    public async add(operation, data) {
        return await this.append({
            operation: operation,
            data: data,
            database: DatabaseInstance
        })
    }
}