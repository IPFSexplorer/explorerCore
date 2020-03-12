import IPFSconnector from "./IPFSConnector";

export default abstract class PubSub
{
    private static async getNodeAsync()
    {
        return (await IPFSconnector.getInstanceAsync()).node;
    }

    public static async subscribe(
        topic: string,
        handler: (msg: {
            from: String;
            seqno: Buffer;
            data: Buffer;
            topicIDs: Array<String>;
        }) => {}
    )
    {
        const node = await PubSub.getNodeAsync();
        await node.pubsub.subscribe(topic, handler);
    }

    public static async unsubscribe(topic: string)
    {
        const node = await PubSub.getNodeAsync();
        await node.pubsub.unsubscribe(topic);
    }

    public static async publish(topic: string, data: any)
    {
        const node = await PubSub.getNodeAsync();
        await node.pubsub.publish(topic, data);
    }

    public static async peers(topic: string)
    {
        const node = await PubSub.getNodeAsync();
        return await node.pubsub.peers(topic);
    }
}
