import { CID } from "typestub-ipfs";
import IPFSconnector from "@/ipfs/IPFSConnector";

export default abstract class IndexBase {
    protected name: string;
    protected iterator: any;
    protected key: string | number;

    constructor(name: string, iterator: any, key: string | number) {
        this.name = name;
        this.iterator = iterator;
        this.key = key;
    }

    protected async GetOrCreateKey(name: string) {
        const ipfsNode = await IPFSconnector.getInstanceAsync();
        const keys = await ipfsNode.node.key.list();
        let key = keys.find(key => key.name === name);
        if (key) return key;

        return await ipfsNode.node.key.gen(this.name, {
            type: "rsa",
            size: 2048
        });
    }

    public async Publish(root: CID): Promise<Boolean> {
        const ipfsNode = await IPFSconnector.getInstanceAsync();
        this.GetOrCreateKey(this.name);

        return await ipfsNode.node.name.publish(root.toString(), {
            resolve: false,
            lifetime: "24h", // year
            ttl: "10s", // hour
            key: this.name,
            allowOffline: true
        });
    }

    public abstract Create(): Promise<Boolean>;
}
