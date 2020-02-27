import IPFSconnector from "./IPFSConnector";
import CID from "cids";

export default abstract class PIN {
    private static async getNodeAsync() {
        return (await IPFSconnector.getInstanceAsync()).node;
    }


    public static async AddAsync(hash: string | CID) {
        const node = await PIN.getNodeAsync();
        const result = await node.pin.add(hash);
        return result.value;
    }
}
