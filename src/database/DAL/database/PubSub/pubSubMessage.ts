import { PubSubMessageType } from "./MessageType";

export default class PubSubMessage
{
    type: PubSubMessageType;
    value: any;

    constructor(type: PubSubMessageType, value: any)
    {
        this.type = type;
        this.value = value;
    }
}