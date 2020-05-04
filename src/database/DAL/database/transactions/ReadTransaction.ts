import { DbOperation } from "../DBOperations";
import ITransaction from "./ITransaction";
import DatabaseInstance from "../databaseInstance";
import TransactionsBulk from "./TransactionsBulk";
import Queriable from "../../query/queriable";
import DBLog from "../log/DBLog";
import { DBLogPayload } from "../log/DBLogPayload";
import { Serialize, inflate, deflate } from "serialazy";
import AsyncLock from "async-lock";
import Entry from "../../../log/entry";
import PubSubMessage from "../PubSub/pubSubMessage";
import { PubSubMessageType } from "../PubSub/MessageType";


export default class ReadTransaction implements ITransaction
{
    query

    constructor(query: () => Generator)
    {
        this.query = query;
    }

    merge(transaction: ITransaction)
    {
        throw Error("Can not merge read transactions");
    }

    async run(database: DatabaseInstance)
    {

        return await database.lock(async () =>
        {
            return await this.query();
        });
    }

    toString(payloadMapper: (arg0: any) => any = null): string
    {
        return `READ: `;
    }
}
