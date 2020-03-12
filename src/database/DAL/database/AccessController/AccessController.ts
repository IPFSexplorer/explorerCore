import Database from "../databaseStore";
import PubSubMessage from "../PubSub/pubSubMessage";
import IPFSconnector from "../../../../ipfs/IPFSConnector";
import { PubSubMessageType } from "../PubSub/MessageType";
import { delay } from "../../../../common";

const TIMEOUT = 10000;

export default class DBAccessController
{
    private requests: Set<string>;
    private resolver: (value?: void | PromiseLike<void>) => void;
    private ticket: Promise<void>;
    databaseName: string;
    accessChanged: boolean;

    constructor(databaseName: string)
    {
        this.requests = new Set<string>();
        this.databaseName = databaseName;
        this.accessChanged = false;
    }

    requestAccess(from: string)
    {
        this.requests.add(from);
    }

    async takenAccess(by: string)
    {
        const { id } = await (await IPFSconnector.getInstanceAsync()).node.id();
        if (id === by || (by === null && this.getFirst() === id))
        {
            this.resolver();
        }

        this.requests.delete(by);
    }

    getFirst(): string
    {
        return this.requests.values().next().value;
    }

    public returnTicket()
    {
        this.ticket = null;
    }

    private getTicket()
    {
        if (this.ticket)
        {
            this.ticket = new Promise(async (resolve, reject) =>
            {
                this.resolver = resolve;
                while (this.accessChanged)
                    await delay(TIMEOUT);

                resolve();
            });
        }
        return this.ticket;
    }

    async waitForAccess()
    {
        const { id } = await (await IPFSconnector.getInstanceAsync()).node.id();
        this.requestAccess(id);
        await Database.databaseByName(this.databaseName).pubSubListener.publish(new PubSubMessage(
            {
                type: PubSubMessageType.AccessRequest,
                value: id
            }));

        await this.getTicket();
        this.requests.delete(id);

        await Database.databaseByName(this.databaseName).pubSubListener.publish(new PubSubMessage({
            type: PubSubMessageType.AccessTaken,
            value: id
        }));
    }

}