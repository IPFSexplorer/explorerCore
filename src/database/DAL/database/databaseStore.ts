import DatabaseInstance from "./databaseInstance";
import DBcontext from "./DBcontext";
import { DbOptions, DbSyncStrategy } from "./DbConnectOptions";

export default abstract class Database {
    private static _databases = {};
    private static selectedDB = null;
    static DB: any;
    public static connect(
        databaseName: string,
        identity,
        options: DbOptions = {
            syncStrategy: DbSyncStrategy.migrate,
        },
    ) {
        if (!this._databases[databaseName]) {
            this._databases[databaseName] = new DatabaseInstance({
                databaseName,
                identity,
                options,
            });
        }
        return this.databaseByName(databaseName);
    }

    public static use(databaseName) {
        return new DBcontext(this.databaseByName(databaseName));
    }

    public static unselect() {
        this.selectedDB = null;
    }

    public static select(databaseName) {
        this.selectedDB = databaseName;
    }

    public static databaseByName(databaseName): DatabaseInstance {
        return this._databases[databaseName];
    }

    public static get selectedDatabase(): DatabaseInstance {
        return this._databases[this.selectedDB];
    }
}
