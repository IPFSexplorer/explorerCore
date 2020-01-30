import "reflect-metadata";
import logger from "@/logger";
import { Block } from "@/models/Block";
import { BPlusTree } from "@/database/index/bTree/BTree";
import IndexStore from "@/database/DAL/indexes/indexStore";
import { container } from "tsyringe";
import LocalBTreeChildren from "@/database/index/bTree/LocalBTreeChildren";

container.register("BTreeChildren", {
    useClass: LocalBTreeChildren
});

const t = new BPlusTree<number, Block>(4);
for (let h = 0; h < 1000; h++) {
    const block = new Block();
    block.height = h;
    t.add(block.height, block);
}

logger.info("add index block height");
IndexStore.addIndex("block", "height", t);
