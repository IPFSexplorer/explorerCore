import DatabaseInstance from "./databaseInstance";
import DBcontext from "./DBcontext";

export default abstract class Database
{
    private static _databases = {};
    private static selectedDB = null;
    static DB: any;
    public static connect(databaseName: string, identity)
    {
        this._databases[databaseName] = new DatabaseInstance({
            databaseName,
            identity
        });
    }

    public static use(databaseName)
    {
        return new DBcontext(this.databaseByName(databaseName));
    }

    public static unselect()
    {
        this.selectedDB = null;
    }

    public static select(databaseName)
    {
        this.selectedDB = databaseName;
    }

    public static databaseByName(databaseName): DatabaseInstance
    {
        return this._databases[databaseName];
    }

    public static get selectedDatabase(): DatabaseInstance
    {
        return this._databases[this.selectedDB];
    }
}