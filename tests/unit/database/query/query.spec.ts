import logger from "@/logger";
import { Block } from "@/models/Block";
import Queriable from "@/database/query/query";
import { BPlusTree } from "@/database/index/bTree/BTree";
import Index from "@/database/index";
logger.silent = true;

describe("query", function() {
    describe("where", () => {
        it("should find something", () => {
            const block = new Block();
            block.height = 5;
            const t = new BPlusTree<number, Block>();
            t.add(block.height, block);
            Index.addIndex("block-height", t);
            Index.addIndex("block", t);

            new Block().where(b => b.height == 5).all();
        });
    });
});
