import Database from "../databaseStore";
import PubSubMessage from "../PubSub/pubSubMessage";
import IPFSconnector from "../../../../ipfs/IPFSConnector";
import { PubSubMessageType } from "../PubSub/MessageType";

export default class DBAccessController
{
    private requests: Set<string>;
    databaseName: string;

    constructor(databaseName: string)
    {
        this.requests = new Set<string>();
        this.databaseName = databaseName;
    }

    requestAccess(from: string)
    {
        this.requests.add(from);
    }

    takenAccess(by: string)
    {
        this.requests.delete(by);
    }

    getNext(): string
    {
        return this.requests.values().next().value;
    }

    async waitForAccess()
    {
        const { id } = await (await IPFSconnector.getInstanceAsync()).node.id();
        this.requestAccess(id);
        await Database.databaseByName(this.databaseName).pubSubListener.publish(new PubSubMessage(PubSubMessageType.AccessRequest, id));

        // TODO wait for accesss!!!!!!!!!
        // if I am only one (or first one in queue) who is waiting for access and previous head was null, 

        await Database.databaseByName(this.databaseName).pubSubListener.publish(new PubSubMessage(PubSubMessageType.AccessTaken, id));
        this.takenAccess(id);
    }

}