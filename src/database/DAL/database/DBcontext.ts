import DatabaseInstance from "./databaseInstance";
import Database from "./databaseStore";

export default class DBcontext {
    private database: DatabaseInstance;

    constructor(db: DatabaseInstance) {
        this.database = db
    }
    public async execute(fn: () => Promise<void>) {
        Database.select(this.database.databaseName)
        await fn()
        Database.unselect()
    }
}