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

@Serialize.Type({
    down: (tx: LoggedTransaction) => {
        return {
            type: tx.operation,
            data: tx.data,
        };
    },
    up: (tx: any) => {
        if (tx.hasOwnProperty("transactions")) {
            return new TransactionsBulk({
                transactions: tx.transactions.map((tx) => inflate(LoggedTransaction, tx)),
            });
        } else {
            return new LoggedTransaction(tx);
        }
    },
})
export default class LoggedTransaction implements ITransaction {
    operation: DbOperation;
    data: any;

    constructor(init?: Partial<LoggedTransaction>) {
        Object.assign(this, init);
    }

    merge(transaction: ITransaction) {
        const bulk = new TransactionsBulk({ transactions: [this, transaction] });
        return bulk;
    }

    async run(database: DatabaseInstance) {
        //console.log(`Start: ${this}`);
        await database.accessController.waitForAccess();
        //console.log(`Lock: ${this}`);

        await database.lock(async () => {
            //console.log(`Run: ${this}`);
            switch (this.operation) {
                case DbOperation.Create:
                    await database
                        .getTableByEntity(this.data as Queriable<any>)
                        .insert(this.data as Queriable<any>, database.identity);
                    break;

                case DbOperation.Delete:
                    await database.getTableByEntity(this.data as Queriable<any>).delete(this.data as Queriable<any>);
                    break;

                case DbOperation.Update:
                    await database.getTableByEntity(this.data as Queriable<any>).update(this.data as Queriable<any>);
                    break;

                default:
                    throw Error(`wrong db operation ${this.operation}`);
            }
        });

        let entry: Entry;
        if (database.transactionsQueue.length <= 1) {
            entry = await database.log.append({
                transaction: this,
                database: await database.toMultihash(),
                parent: database.log.head ? database.log.head.hash : null,
            } as DBLogPayload);
            await database.pubSubListener.publish(
                new PubSubMessage({
                    type: PubSubMessageType.PublishVersion,
                    value: (await database.log.toMultihash()).toString(),
                }),
            );

            await database.accessController.returnTicket();
        } else {
            entry = await database.log.append({
                transaction: this,
                parent: database.log.head ? database.log.head.hash : null,
            } as DBLogPayload);
        }

        database.log.head = entry;
        return entry;

        //console.log(`Finish: ${this}`);
    }

    toString(payloadMapper: (arg0: any) => any = null): string {
        try {
            return `${this.operation}: ${payloadMapper ? payloadMapper(this.data) : this.data}`;
        } catch (e) {
            console.log("error");
            return "Errrorrr";
        }
    }
}
