import "reflect-metadata";
import logger from "@/logger";
import { Block } from "@/models/Block";
import { BPlusTree } from "@/database/index/bTree/BTree";
import IndexStore from "@/database/DAL/indexes/indexStore";
import { container } from "tsyringe";
import LocalBTreeChildren from "@/database/index/bTree/LocalBTreeChildren";

describe("query", function() {
    beforeAll(async () => {
        logger.silent = false;
        container.register("BTreeChildren", {
            useClass: LocalBTreeChildren
        });
    });

    describe("where", () => {
        it("should find something", () => {
            const t = new BPlusTree<number, Block>();
            for (let h = 0; h < 1000; h++) {
                const block = new Block();
                block.height = h;
                t.add(block.height, block);
            }

            IndexStore.addIndex("block", "height", t);

            const results = new Block()
                .where("height")
                .gt(5)
                .all();
            logger.info(results);
        });
    });
});
