import DatabaseInstance from "./databaseInstance"
import { Guid } from "guid-typescript"

export default abstract class Database {
    private static _databases = {}
    private static selectedDB = ""
    public static connectOrCreate(databaseName: string, userName: string = Guid.create().toString()) {
        this._databases[databaseName] = new DatabaseInstance(databaseName, userName)
    }

    public static use(databaseName, fn: () => void) {
        const __SELECTED_DB__ = databaseName
        fn()
    }

    public static databaseByName(databaseName) {
        return this._databases[databaseName]
    }

    static get selectedDatabase() {

        return this._databases[this.selectedDB]
    }
}