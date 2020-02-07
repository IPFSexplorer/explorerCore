import logger from "@/logger";
import BTree from "@/database/index/DABtree/btree";

describe("btree", function () {
    beforeAll(async () => {
        logger.silent = false;
    });

    describe("insert", () => {
        it("should create and insert elements to B+tree", async () => {
            const t = new BTree<number, string>();
            t.insert(5, "five");
            expect(t.keys()[0]).toBe(5);
            expect(t.entries()[0]).toBe("five");
        });

        it("should create and insert 1000 elements to B+tree", async () => {
            const t = new BTree(4);
            for (let i = 0; i <= 30; i++) {
                await t.insert(i, { ffffuha: i });
                //logger.info(await t.print());
            }

            for (let i = 0; i <= 30; i++) {
                //logger.info(i.toString());
                expect(await t.search(i)).toStrictEqual({ ffffuha: i });
            }

            expect(await t.search(1001)).toBeNull();
        });
    });
});
