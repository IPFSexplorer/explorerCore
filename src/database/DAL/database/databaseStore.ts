import DatabaseInstance from "./database"

export default abstract class DatabaseStore {
    private static _database
    public static connectOrCreate(databaseName: string, userName: string) {
        new DatabaseInstance(databaseName, userName)
    }

    static get database() {
        return this._database
    }
}