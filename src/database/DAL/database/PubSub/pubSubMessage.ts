import { PubSubMessageType } from "./MessageType";
import { Serialize } from "serialazy";

export default class PubSubMessage
{

    @Serialize.Custom({
        down: (type: PubSubMessageType) => type,
        up: (type: string) => PubSubMessageType[type]
    }) type: PubSubMessageType;
    @Serialize({ nullable: true }) value: string;

    constructor(init?: Partial<PubSubMessage>)
    {
        Object.assign(this, init);
    }
}