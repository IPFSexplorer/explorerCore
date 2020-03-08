import { DbOperation } from "../DBOperations";

export default class Transaction
{
    operation: DbOperation;
    data: object;

    constructor(operation, data)
    {
        this.operation = operation;
        this.data = data;
    }
}