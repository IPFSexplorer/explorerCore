import "reflect-metadata";
import logger from "@/logger";
import { BPlusTree } from "@/database/index/bTree/BTree";
import { container } from "tsyringe";
import LocalBTreeChildren from "@/database/index/bTree/LocalBTreeChildren";

describe("btree", function() {
    beforeAll(async () => {
        logger.silent = false;
        container.register("BTreeChildren", {
            useClass: LocalBTreeChildren
        });
    });

    describe("insert", () => {
        it("should create and insert elements to B+tree", () => {
            const t = new BPlusTree<string, number>();
            t.add("five", 5);
            expect(t.find("five")).toBe(5);
        });

        it("should create and insert 1000 elements to B+tree", () => {
            const t = new BPlusTree();
            for (let i = 0; i <= 1000; i++) {
                t.add(i, { ffffuha: i });
                // logger.info(t.print())
            }

            for (let i = 0; i <= 1000; i++) {
                logger.info(i.toString());
                expect(t.find(i)).toStrictEqual({ ffffuha: i });
            }

            expect(t.find(1001)).toBeNull();
        });

        it("should find previous and next leaf", () => {
            let branchFactor = 4;
            const t = new BPlusTree(branchFactor);
            for (let i = 0; i <= 100; i++) {
                t.add(i, { ffffuha: i });
            }

            for (let i = 4; i <= 96; i++) {
                let node = t.findLeaf(i);
                expect(node.previousNode.nextNode).toStrictEqual(node);
                expect(node.nextNode.previousNode).toStrictEqual(node);
            }
        });
    });
});
