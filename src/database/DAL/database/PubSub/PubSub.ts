import PubSubMessage from "./pubSubMessage";
import PubSub from "../../../../ipfs/PubSub";
import { PubSubMessageType } from "./MessageType";
import Database from "../databaseStore";
import { inflate, deflate } from "serialazy";

export default class PubSubListener
{
    databaseName: string;
    constructor(databaseName: string)
    {
        this.databaseName = databaseName;
    }

    async start()
    {
        await PubSub.subscribe(this.databaseName, this.onEvent.bind(this));
        // TODO we should maybe send a message to other peers that we are new peer. Some of the other peers than could sent theirs heads
    }

    async stop()
    {
        await PubSub.unsubscribe(this.databaseName);
    }

    async publish(data: PubSubMessage)
    {
        console.log({ _: "PUB", ...data });
        await PubSub.publish(this.databaseName, JSON.stringify(deflate(data)));
    }

    async onEvent(msg: {
        from: String;
        seqno: Buffer;
        data: Buffer;
        topicIDs: Array<String>;
    }): Promise<void>
    {
        const message: PubSubMessage = inflate(PubSubMessage, JSON.parse(msg.data.toString()));

        console.log({ _: "SUB", ...message });

        switch (message.type)
        {
            case PubSubMessageType.PublishVersion:
                await Database.databaseByName(this.databaseName).syncLog(message.value);
                break;

            case PubSubMessageType.AccessRequest:
                Database.databaseByName(this.databaseName).accessController.requestAccess(message.value);
                break;
            case PubSubMessageType.AccessTaken:
                Database.databaseByName(this.databaseName).accessController.takenAccess(message.value);
                break;
        }

    }

}