import logger from "@/logger";
import { Block } from "@/models/Block";
import IndexStore from "@/database/DAL/indexes/indexStore";

import BlocksGetter from "@/../tests/demoData/BlockGetter";
import BTree from "@/database/index/bTree/BTree";

logger.silent = true;

describe("query", function() {
    beforeAll(async () => {
        logger.silent = true;
    });

    describe("where", () => {
        it("should find something", async () => {
            const t = new BTree<number, Block>();
            for (let h = 0; h < 100; h++) {
                const block = new Block();
                block.height = h;
                await t.insert(block.height, block);
            }

            IndexStore.addIndex("block", "height", t);

            const results = await new Block()
                .where("height")
                .greatherThan(5)
                .all();
            logger.info(results);
        }, 36000000);
    });

    describe("equal", () => {
        it("should find something equal", async () => {
            const t = new BTree<number, Block>();
            for (let h = 0; h < 1000; h++) {
                const block = new Block();
                block.height = h;
                await t.insert(block.height, block);
            }

            IndexStore.addIndex("block", "height", t);

            const results = await new Block()
                .where("height")
                .equal(5)
                .all();
            logger.info(results);
        });
    });

    describe("comparators", () => {
        it("should find somethin by string key", async () => {
            const t = new BTree<string, Block>(8);

            const blockGetter = new BlocksGetter(10);
            for await (let b of blockGetter) {
                const block = new Block(b);
                //console.log(block);
                await t.insert(b.hash, block);
            }

            IndexStore.addIndex("block", "hash", t);

            const results = await new Block()
                .where("hash")
                .equal(
                    "000000006a906fbef861f23ce8ff5fae146675508fa5ec64817db5c81be04019"
                )
                .all();
            logger.info(results);
        });
    });
});
