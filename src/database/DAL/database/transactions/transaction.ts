import { DbOperation } from "../DBOperations";
import ITransaction from "./ITransaction";
import DatabaseInstance from "../databaseInstance";
import TransactionsBulk from "./TransactionsBulk";
import Queriable from "../../query/queriable";
import DBLog from "../log/DBLog";
import { DBLogPayload } from "../log/DBLogPayload";
import { Serialize, inflate, deflate } from "serialazy";
import AsyncLock from "async-lock";

@Serialize.Type({
    down: (tx: Transaction) =>
    {
        return {
            type: tx.operation,
            data: tx.data
        };
    },
    up: (tx: any) =>
    {
        if (tx.hasOwnProperty("transactions"))
        {
            return new TransactionsBulk(
                {
                    transactions: (tx).transactions.map(tx => inflate(Transaction, tx))
                });
        } else
        {
            return new Transaction(tx);
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
        //console.log(`Start: ${this}`);
        await database.accessController.waitForAccess();
        //console.log(`Lock: ${this}`);

        await database.lock(async () =>
        {
            //console.log(`Run: ${this}`);
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

                default:
                    throw Error(`wrong db operation ${this.operation}`);
            }
        });

        //console.log(`Finish: ${this}`);
    }

    toString(payloadMapper: (arg0: any) => any = null): string
    {
        try
        {

            return `${this.operation}: ${(payloadMapper ? payloadMapper(this.data) : this.data)}`;
        }
        catch (e)
        {
            console.log("error");
            return "Errrorrr";
        }
    }
}
