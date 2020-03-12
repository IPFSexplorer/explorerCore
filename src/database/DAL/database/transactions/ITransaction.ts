import DatabaseInstance from "../databaseInstance";

export default interface ITransaction
{

    run(database: DatabaseInstance);
    merge(transaction: ITransaction);
}