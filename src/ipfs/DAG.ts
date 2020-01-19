import IPFSconnector from "./IPFSConnector";

export default abstract class DAG {
    private static async getNodeAsync() {
        return (await IPFSconnector.getInstanceAsync()).node;
    }

    public static async PutAsync(data: any) {
        const node = await DAG.getNodeAsync();
        const cid = await node.dag.put(data);
        return cid;
    }

    public static async Get(cid: string, path: string) {
        const node = await DAG.getNodeAsync();
        const result = await node.dag.get(cid, path);
        return result.value;
    }
}
