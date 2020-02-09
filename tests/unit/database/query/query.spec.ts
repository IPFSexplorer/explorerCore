import logger from "@/logger";
import { Block } from "@/models/Block";
import IndexStore from "@/database/DAL/indexes/indexStore";

import BlocksGetter from "@/../tests/demoData/BlockGetter";
import BTree from "@/database/BTree/BTree";

logger.silent = true;

describe("query", function () {
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
        });
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
            const blockGetter = new BlocksGetter(10);
            for await (let b of blockGetter) {
                const block = new Block(b);
                await block.save()
            }

            const results = await new Block()
                .where("height")
                .greatherThan(5)
                .all();
            logger.info(results);
        }, 36000000);
    });
});
