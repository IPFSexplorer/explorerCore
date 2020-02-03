import "reflect-metadata";
import logger from "@/logger";
import { Block } from "@/models/Block";
import { BPlusTree } from "@/database/index/bTree/BTree";
import IndexStore from "@/database/DAL/indexes/indexStore";
import { container } from "tsyringe";
import LocalBTreeChildren from "@/database/index/bTree/LocalBTreeChildren";
import BlocksGetter from 'tests/demoData/BlockGetter';

container.register("BTreeChildren", {
    useClass: LocalBTreeChildren
});

const t = new BPlusTree<number, Block>(8);
(async function () {
    const blockGetter = new BlocksGetter();
    for await (let b of blockGetter) {
        const block = new Block(b);
        //console.log(block);
        await t.add(b.height, block);
    }

    logger.info("add index block height");
    //console.log(await t.print());
    IndexStore.addIndex("block", "height", t);
})();
