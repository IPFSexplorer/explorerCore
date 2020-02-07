import "reflect-metadata";
import logger from "@/logger";
import BTree from "@/database/index/DABtree/btree";
import IPFSconnector from '@/ipfs/IPFSConnector';

describe("btree", function () {
    beforeAll(async () => {
        logger.silent = false;
    });

    beforeEach(async () => {
        IPFSconnector.setConfig({
            repo: "/.ipfsBTreeTests"
        });
        return await IPFSconnector.getInstanceAsync();
    });

    afterEach(async () => {
        return (await IPFSconnector.getInstanceAsync()).shutDownAsync();
    });


    describe("insert", () => {
        it("should create and insert elements to B+tree", async () => {
            const t = new BTree<number, string>();
            t.insert(5, "five");
            expect(t.keys()[0]).toBe(5);
            expect(t.entries()[0]).toBe("five");
        });

        it("should create and insert 1000 elements to B+tree", async () => {
            const t = new BTree<number, object>(4);
            for (let i = 0; i <= 1000; i++) {
                await t.insert(i, { ffffuha: i });
                //logger.info(await t.print());
            }

            await (await t.search(1)).traverse((k, v) =>
                logger.info(k + " " + JSON.stringify(v))
            );
        }, 36000000);
    });
});
