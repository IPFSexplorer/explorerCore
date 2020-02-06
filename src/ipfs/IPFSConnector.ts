import IPFStype from "typestub-ipfs";
import ipfsDefaultConfig from "./ipfsDefaultConfig";
import logger from "../logger";
import IPFS from "ipfs";

export default class IPFSconnector {
    private static instance: IPFSconnector;
    private static config: object = ipfsDefaultConfig;
    private _node: any;

    static setConfig(config: object) {
        IPFSconnector.config = config;
    }

    static async getInstanceAsync() {
        if (!IPFSconnector.instance) {
            IPFSconnector.instance = new IPFSconnector();

            IPFSconnector.instance._node = await IPFS.create(
                IPFSconnector.config
            );
            logger.info("node started!");

            // setInterval(async () => {
            //     try {
            //         const peers = await IPFSconnector.instance.node.swarm.peers();
            //         console.log(`The node now has ${peers.length} peers.`);
            //     } catch (err) {
            //         console.log("An error occurred trying to check our peers:", err);
            //     }
            // }, 2000);

            // // Log out the bandwidth stats every 4 seconds so we can see how our configuration is doing
            // setInterval(async () => {
            //     try {
            //         const stats = await IPFSconnector.instance.node.stats.bw();
            //         console.log(`\nBandwidth Stats: ${JSON.stringify(stats, null, 2)}\n`);
            //     } catch (err) {
            //         console.log("An error occurred trying to check our stats:", err);
            //     }
            // }, 4000);
        }
        return IPFSconnector.instance;
    }

    get node(): any {
        return this._node;
    }

    public async shutDownAsync() {
        try {
            await this._node.stop();
            logger.info("Node stopped!");
        } catch (error) {
            logger.error("Node failed to stop!", error);
        }
    }
}
