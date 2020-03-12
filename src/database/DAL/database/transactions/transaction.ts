import { DbOperation } from "../DBOperations";
import ITransaction from "./ITransaction";
import DatabaseInstance from "../databaseInstance";
import TransactionsBulk from "./TransactionsBulk";
import Queriable from "../../query/queriable";
import DBLog from "../log/DBLog";
import { DBLogPayload } from "../log/DBLogPayload";

export default class Transaction implements ITransaction
{
    operation: DbOperation;
    data: object;

    constructor(init?: Partial<Transaction>)
    {
        Object.assign(this, init);
    }
    merge(transaction: ITransaction)
    {
        const bulk = new TransactionsBulk();
        bulk;
        return bulk;
    }

    async run(database: DatabaseInstance)
    {
        await database.accessController.waitForAccess();
        switch (this.operation)
        {
            case DbOperation.Create:
                await database
                    .getOrCreateTableByEntity(this.data as Queriable<any>)
                    .insert(this.data as Queriable<any>);
                break;

            case DbOperation.Delete:

                break;

            case DbOperation.Update:

                break;

            case DbOperation.Merge:
                await database.log.merge(this.data as DBLog);
                database.accessController.takenAccess((database.log.head.payload as DBLogPayload).grantAccessTo);
                return;


            default:
                throw Error(`wrong db operation ${this.operation}`);
        }
    }
}