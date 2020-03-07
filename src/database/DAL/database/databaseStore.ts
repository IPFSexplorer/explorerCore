import DatabaseInstance from "./databaseInstance"
import { Guid } from "guid-typescript"
import DBcontext from "./DBcontext"
import { inflate } from "serialazy"
import Log from "../../log/log"
import DBLog from "./DBLog"

export default abstract class Database {
    private static _databases = {}
    private static selectedDB = null
    static DB: any
    public static connectOrCreate(databaseName: string, userName: string = Guid.create().toString()) {
        this._databases[databaseName] = new DatabaseInstance()
        this._databases[databaseName].databaseName = databaseName
        this._databases[databaseName].userName = userName
    }

    public static use(databaseName) {
        return new DBcontext(this.databaseByName(databaseName))
    }

    public static unselect() {
        this.selectedDB = null
    }

    public static select(databaseName) {
        this.selectedDB = databaseName
    }

    public static databaseByName(databaseName) {
        return this._databases[databaseName]
    }

    public static get selectedDatabase(): DatabaseInstance {
        return this._databases[this.selectedDB]
    }
}