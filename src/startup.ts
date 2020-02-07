import "reflect-metadata";
import logger from "@/logger";
import { Block } from "@/models/Block";
import { BPlusTree } from "@/database/index/bTree/BTree";
import IndexStore from "@/database/DAL/indexes/indexStore";
import { container } from "tsyringe";
import LocalBTreeChildren from "@/database/index/bTree/local/LocalBTreeChildren";
import BlocksGetter from "@/../tests/demoData/BlockGetter";

container.register("BTreeChildren", {
    useClass: LocalBTreeChildren
});

const hashIndex = new BPlusTree<number, Block>(4);
const heightIndex = new BPlusTree<number, Block>(4);
(async function() {
    const blockGetter = new BlocksGetter(10);
    for await (let b of blockGetter) {
        const block = new Block(b);
        await hashIndex.add(b.hash, block);
        await heightIndex.add(b.height, block);
    }

    IndexStore.addIndex("block", "hash", hashIndex);
    IndexStore.addIndex("block", "height", heightIndex);
    console.log(await hashIndex.print());
    console.log(await heightIndex.print());
})();
