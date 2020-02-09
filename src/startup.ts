import logger from "@/logger";
import { Block } from "@/models/Block";
import IndexStore from "@/database/DAL/indexes/indexStore";
import BlocksGetter from "@/../tests/demoData/BlockGetter";
import BTree from "./database/BTree/btree";
import DAG from "./ipfs/DAG";
import IPFSconnector from "./ipfs/IPFSConnector";
import {
    randomPortsConfigAsync,
    browserConfigAsync
} from "./ipfs/ipfsDefaultConfig";

const heightIndex = new BTree<number, Block>(4);
(async function() {
    let config = await browserConfigAsync();
    console.log("seyttyt");
    IPFSconnector.setConfig(config);
    await (await IPFSconnector.getInstanceAsync()).node.swarm.connect(
        "/ip4/127.0.0.1/tcp/14003/ws/ipfs/QmR47HUyLiMomYF6iWz1W1XE6XraSUuC7zjVuXQFBotAE7"
    );

    const blockGetter = new BlocksGetter(100);
    let i = 1;
    for await (let b of blockGetter) {
        const block = new Block(b);
        await heightIndex.insert(b.height, block);
    }
    IndexStore.addIndex("block", "height", heightIndex);
    console.log("index sotred");

    logger.info((await DAG.PutAsync(heightIndex.serialize())).toString());
})();
