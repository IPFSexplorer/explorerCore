import ITransaction from "./ITransaction";
import DatabaseInstance from "../databaseInstance";
import LoggedTransaction from "./LoggedTransaction";

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

    get length()
    {
        return this.transactions.length;
    }

    async run(database: DatabaseInstance)
    {
        for (const transaction of this.transactions.reverse())
        {
            await transaction.run(database);
        }
        return true;
    }


    toString(payloadMapper: (arg0: any) => any = null): string
    {
        return this.transactions.reduce((str, t) => str + t.toString(payloadMapper) + ", ", "");
    }

}