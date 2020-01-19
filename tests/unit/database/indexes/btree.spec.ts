import IPFSconnector from "@/ipfs/IPFSConnector";
import logger from "@/logger";
import { BPlusTree } from "@/database/index/bTree/BTree";

logger.silent = true;

describe("btree", function () {
    describe("insert", () => {
        it("should create and insert elements to B+tree", () => {
            const t = new BPlusTree<string, number>();
            t.add("five", 5);
            expect(t.find("five")).toBe(5);
        });
    });

    describe("should create and insert 1000 elements to B+tree", () => {
        const t = new BPlusTree();
        for (let i = 0; i <= 1000; i++) {
            t.add(i, { ffffuha: i });
        }

        for (let i = 0; i <= 1000; i++) {
            expect(t.find(i)).toStrictEqual({ ffffuha: i });
        }

        expect(t.find(1001)).toBeNull();
    });
});
