import logger from "../logger";
import IPFS from "ipfs";

export default class IPFSconnector
{
    private static instance: IPFSconnector;
    private static config: object = {};
    private static _nodeCreatingTask;
    private _node: any;


    static setConfig(config: object)
    {
        IPFSconnector.config = config;
    }

    static async getInstanceAsync()
    {
        if (!IPFSconnector.instance)
        {
            console.log("connectiong");
            IPFSconnector.instance = new IPFSconnector();

            IPFSconnector._nodeCreatingTask = IPFS.create(
                IPFSconnector.config
            );
            IPFSconnector.instance._node = await IPFSconnector._nodeCreatingTask;
            logger.info("node started!");
        }

        await IPFSconnector._nodeCreatingTask;
        return IPFSconnector.instance;
    }

    get node(): any
    {
        return this._node;
    }

    public async shutDownAsync()
    {
        try
        {
            await this._node.stop();
            logger.info("Node stopped!");
        } catch (error)
        {
            logger.error("Node failed to stop!", error);
        }
    }
}
