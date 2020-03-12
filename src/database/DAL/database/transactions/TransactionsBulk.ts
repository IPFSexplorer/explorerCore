import ITransaction from "./ITransaction";
import DatabaseInstance from "../databaseInstance";
import Transaction from "./Transaction";

export default class TransactionsBulk implements ITransaction
{
    private transactions: ITransaction[];
    constructor()
    {
        this.transactions = [];
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
    }

}