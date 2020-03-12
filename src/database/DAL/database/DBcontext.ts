import DatabaseInstance from "./databaseInstance";
import Database from "./databaseStore";

export default class DBcontext
{
    private database: DatabaseInstance;

    constructor(db: DatabaseInstance)
    {
        this.database = db;
    }
    public async execute(fn: (db) => Promise<void>)
    {
        Database.select(this.database.databaseName);
        await fn(this.database);
        Database.unselect();
    }

    public executeSync(fn: (db) => void)
    {
        Database.select(this.database.databaseName);
        fn(this.database);
        Database.unselect();
    }
}