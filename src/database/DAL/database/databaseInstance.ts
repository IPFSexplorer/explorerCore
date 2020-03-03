import Table from "../tables/table";
import DBLog from "./DBLog";
import Queriable from "../query/queriable";
import IdentityProvider from "orbit-db-identity-provider"
import { DbOperation } from "./DBOperations";
import Log from "../../log/log";
import { deflate, inflate, Serialize } from 'serialazy';
import { Guid } from "guid-typescript";

export default class DatabaseInstance {
    private tables: { [property: string]: Table } = {};
    private log: DBLog;
    // only local operation used when we want to fast apply migrations
    private localLog: Log
    private time: number
    private databaseName: string
    private userName: string

    constructor(databaseName, userName) {
        this.databaseName = databaseName
        this.userName = userName
    }

    public async getOrCreateLog() {
        if (!this.log) {
            const identity = await IdentityProvider.createIdentity({ id: this.userName })
            this.log = new DBLog(identity, this.databaseName)
            this.addToLog(DbOperation.Init)
        }

        return this.log
    }

    private async addToLog(operation, value = null) {
        await (await this.getOrCreateLog()).add(this.toMultihash, operation, value)
    }

    public async create(table: string, entity: Queriable<any>) {
        const insertedEntityAddress = await this.getTable(table).insert(entity)
        this.addToLog(DbOperation.Create, insertedEntityAddress)
    }

    public update(table, address, newData) {

    }

    public remove(table, data) {

    }

    public addTable(tableName: string) {
        this.tables[tableName] = new Table(tableName)
    }

    public getTable(tableName: string): Table {
        if (this.tables.hasOwnProperty(tableName))
            return this.tables[tableName]
        else return null
    }

    public publishDatabase() {

    }

    public mergeDatabase(anotherLog: DBLog) {
        // this.time = this.log.merge(anotherLog)
    }

    public toJson() {

    }

    public fromMultihash() {

    }

    public toMultihash() {
        return Guid.create().toString()
    }
}