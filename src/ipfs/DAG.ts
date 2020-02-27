import IPFSconnector from "./IPFSConnector";
import CID from "cids";

export default abstract class DAG {
    private static async getNodeAsync() {
        return (await IPFSconnector.getInstanceAsync()).node;
    }

    public static async PutAsync(data: any, options) {
        const node = await DAG.getNodeAsync();
        const cid = await node.dag.put(data, options);
        return cid;
    }

    public static async GetAsync(cid: string | CID, path: string = "") {
        const node = await DAG.getNodeAsync();
        const result = await node.dag.get(cid, path);
        return result.value;
    }
}
