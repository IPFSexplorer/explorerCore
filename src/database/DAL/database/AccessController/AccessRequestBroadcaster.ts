import Database from "explorer-core/src/database/DAL/database/databaseStore";
import PubSubMessage from "explorer-core/src/database/DAL/database/PubSub/pubSubMessage";
import { PubSubMessageType } from "explorer-core/src/database/DAL/database/PubSub/MessageType";
import { delay } from "explorer-core/src/common";

const ACCESS_REQUEST_INTERVAL = 2500;

export default class AccessRequestBroadcaster
{
    databaseName: string;
    id: string;
    running: any;
    constructor(databaseName: string, id: string, autoStart: boolean = false)
    {
        this.databaseName = databaseName;
        this.id = id;
        this.running = Boolean;
        this.start();
    }

    async start()
    {
        console.log("acces request broadcaster start");
        while (this.running)
        {
            await Database.databaseByName(this.databaseName).pubSubListener.publish(new PubSubMessage(
                {
                    type: PubSubMessageType.AccessRequest,
                    value: this.id
                }));
            await delay(ACCESS_REQUEST_INTERVAL);
        }

    }

    stop()
    {
        console.log("acces request broadcaster stop");
        this.running = false;
        Database.databaseByName(this.databaseName).pubSubListener.publish(new PubSubMessage({
            type: PubSubMessageType.AccessTaken,
            value: this.id
        }));
    }
}