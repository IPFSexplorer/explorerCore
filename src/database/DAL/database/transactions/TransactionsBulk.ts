import ITransaction from "./ITransaction";
import DatabaseInstance from "../databaseInstance";
import Transaction from "./Transaction";

export default class TransactionsBulk implements ITransaction
{
    public transactions: ITransaction[];
    constructor(init: Partial<TransactionsBulk> = { transactions: [] })
    {
        Object.assign(this, init);

    };



    merge(transaction: ITransaction)
    {
        this.transactions.push(transaction);
    }

    async run(database: DatabaseInstance)
    {
        for (const transaction of this.transactions)
        {
            await transaction.run(database);
        }
        return true;
    }


    toString()
    {
        return this.transactions.reduce((str, t) => str + t.toString() + ", ", "");
    }

}