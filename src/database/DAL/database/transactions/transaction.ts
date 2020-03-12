import { DbOperation } from "../DBOperations";
import ITransaction from "./ITransaction";
import DatabaseInstance from "../databaseInstance";
import TransactionsBulk from "./TransactionsBulk";
import Queriable from "../../query/queriable";
import DBLog from "../log/DBLog";
import { DBLogPayload } from "../log/DBLogPayload";
import { Serialize, inflate, deflate } from "serialazy";

@Serialize.Type({
    down: (tx: Transaction) =>
    {
        return {
            type: tx.operation,
            data: tx.data
        };
    },
    up: (tx) =>
    {
        if (Array.isArray(tx))
        {
            return new TransactionsBulk(tx);
        } else
        {
            return new Transaction(tx as object);
        }
    }
})
export default class Transaction implements ITransaction
{
    operation: DbOperation;
    data: any;

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
        console.log(`Start: ${this}`);
        await database.accessController.waitForAccess();
        console.log(`Run: ${this}`);
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
                const dbLog = await DBLog.fromMultihash(database.identity, database.databaseName, this.data);
                await database.log.merge(dbLog);
                database.accessController.takenAccess((database.log.head.payload as DBLogPayload).grantAccessTo);
                return;


            default:
                throw Error(`wrong db operation ${this.operation}`);
        }
        console.log(`Finish: ${this}`);
        return true;
    }

    toString()
    {
        return `${this.operation}: ${this.data}`;
    }
}