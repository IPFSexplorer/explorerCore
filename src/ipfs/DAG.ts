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

    public static async GetAsync(cid: string, path: string = null) {
        const node = await DAG.getNodeAsync();
        const result = await node.dag.get(cid, path);
        return result.value;
    }
}
