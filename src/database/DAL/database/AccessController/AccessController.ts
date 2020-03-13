import Database from "../databaseStore";
import PubSubMessage from "../PubSub/pubSubMessage";
import IPFSconnector from "../../../../ipfs/IPFSConnector";
import { PubSubMessageType } from "../PubSub/MessageType";
import { delay } from "../../../../common";
import { EventEmitter } from "events";
import AccessRequestBroadcaster from "./AccessRequestBroadcaster";

const TIMEOUT = 5000;

export default class DBAccessController extends EventEmitter
{
    requests: Set<string>;
    private resolver: (value?: void | PromiseLike<void>) => void;
    private ticket: Promise<void>;
    databaseName: string;
    accessChanged: boolean;

    constructor(databaseName: string)
    {
        super();
        this.requests = new Set<string>();
        this.databaseName = databaseName;
        this.accessChanged = true;
    }

    requestAccess(from: string)
    {
        this.requests.add(from);
        this.emit("change", this.requests);
    }

    async takenAccess(by: string)
    {

        const { id } = await (await IPFSconnector.getInstanceAsync()).node.id();
        if (id === by || (by === null && this.getFirst() === id))
        {
            console.log("somebody give me access");
            if (this.ticket)
            {
                this.resolver();
            }
            else
            {
                // TODO grant access to somebody else because I dont want it
            }
        }

        this.accessChanged = true;
        this.requests.delete(by);
        this.emit("change", this.requests);
    }

    getFirst(): string
    {
        return this.requests.values().next().value;
    }

    public returnTicket()
    {
        this.ticket = null;
    }

    private getTicket(id)
    {
        if (!this.ticket)
        {
            const accessRequestBroadcaster = new AccessRequestBroadcaster(this.databaseName, id, true);
            this.ticket = new Promise(async function (resolve, reject) 
            {
                this.resolver = resolve;
                while (this.accessChanged)
                {
                    this.accessChanged = false;
                    await delay(TIMEOUT);
                }

                console.log("long time nobody takes access");
                resolve();
            }.bind(this));

            this.ticket.finally(() =>
            {
                accessRequestBroadcaster.stop();
            });
        }
        return this.ticket;
    }

    async waitForAccess()
    {
        const { id } = await (await IPFSconnector.getInstanceAsync()).node.id();
        this.requestAccess(id);

        await this.getTicket(id);
        this.requests.delete(id);
        this.accessChanged = true;
    }

}