import Database from "../databaseStore";
import PubSubMessage from "../PubSub/pubSubMessage";
import IPFSconnector from "../../../../ipfs/IPFSConnector";
import { PubSubMessageType } from "../PubSub/MessageType";
import { delay } from "../../../../common";
import { EventEmitter } from "events";
import AccessBroadcaster from "./AccessBroadcaster";

const TIMEOUT = 10000;
const WAIT_FOR_MORE_TRANSACTIONS = 3000;
const POLITE_MODE = false;

export default class DBAccessController extends EventEmitter
{
    requests: Set<string>;
    private resolver: (value?: void | PromiseLike<void>) => void;
    private ticket: Promise<void>;
    databaseName: string;
    accessChanged: boolean;
    _accessBroadcaster: AccessBroadcaster;
    id: string;

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

    takenAccess(peerId: string)
    {
        this.accessChanged = true;
        this.requests.delete(peerId);

        this.emit("change", this.requests);
    }

    async accessGranted(to: string, from: string)
    {
        if (to === this.id)
        {
            if (this.ticket)
            {
                console.log("access given");
                this.resolver();
            }
            else
            {
                console.log("give accesss to sombeody else");
                await this.returnTicket();
            }
        }
    }


    getFirst(): string
    {
        return this.requests.values().next().value;
    }

    async getAccessBroadcasterAsync()
    {
        if (!this._accessBroadcaster)
        {
            const { id } = await (await IPFSconnector.getInstanceAsync()).node.id();
            this.id = id;
            console.log(id);
            this._accessBroadcaster = new AccessBroadcaster(this.databaseName, id);
        }
        return this._accessBroadcaster;
    }

    public async returnTicket()
    {
        this.ticket = null;
        await (await this.getAccessBroadcasterAsync()).return(this.getFirst());
    }

    private async getTicket()
    {
        if (POLITE_MODE) {
            if (!this.ticket)
            {
                this.ticket = new Promise(async function (resolve, reject) 
                {
                    this.resolver = resolve;

                    await (await this.getAccessBroadcasterAsync()).request();
                    this.requestAccess(this.id);

                    await delay(WAIT_FOR_MORE_TRANSACTIONS);

                    while (this.accessChanged && ((this.requests as Set<string>).size > 1) && this.getFirst() != this.id)
                    {
                        this.accessChanged = false;
                        await delay(TIMEOUT);
                    }

                    console.log("long time nobody takes access or queue is empty");
                    resolve();
                }.bind(this));

                this.ticket.finally(async () =>
                {
                    this.takenAccess(this.id);
                    await (await this.getAccessBroadcasterAsync()).take();
                });
            }
        }
        return this.ticket;
    }

    async waitForAccess()
    {
        await this.getTicket();
    }

}