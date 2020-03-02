import Table from "../tables/table";
import DBLog from "./DBLog";
import DBentity from "../query/DBentity";
import IdentityProvider from "orbit-db-identity-provider"
import { DbOperation } from "./DBOperations";

export default abstract class Database {
    private static tables: { [property: string]: Table } = {};
    private static log: DBLog;

    public static async getOrCreateLog() {
        if (!Database.log) {
            const identity = await IdentityProvider.createIdentity({ id: 'peerid' })
            Database.log = new DBLog(identity)
        }

        return Database.log
    }

    public static async create(table: string, entity: DBentity<any>) {
        const insertedEntity = await Database.getTable(table).insert(entity)
        await (await Database.getOrCreateLog()).add(DbOperation.Create, insertedEntity)
    }

    public static update(table, address, newData) {

    }

    public static remove(table, data) {

    }

    public static addTable(tableName: string) {
        Database.tables[tableName] = new Table(tableName)
    }

    public static getTable(tableName: string): Table {
        if (Database.tables.hasOwnProperty(tableName))
            return Database.tables[tableName]
        else return null
    }

    public publishDatabase() {

    }

    public mergeDatabase(anotherLog: DBLog) {
        Database.log.merge(anotherLog)
    }
}