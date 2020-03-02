import Log from "../../log/log";
import Database from "./database";

export default class DBLog extends Log {
    public merge(log: DBLog) {
        const newItems = Log.difference(log, this)
        this.join(log)
        // TODO check head etc.
    }

    public async add(operation, data) {
        return await this.append({
            operation: operation,
            data: data,
            database: Database
        })
    }
}