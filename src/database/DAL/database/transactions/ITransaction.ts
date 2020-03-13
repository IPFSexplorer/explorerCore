import DatabaseInstance from "../databaseInstance";

export default interface ITransaction
{

    run(database: DatabaseInstance);
    merge(transaction: ITransaction);
    toString(payloadMapper: (arg0: any) => any): string;
}