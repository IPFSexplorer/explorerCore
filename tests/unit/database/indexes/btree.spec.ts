import logger from "@/logger";
import BTree from "@/database/index/BTree/btree";
import IPFSconnector from "@/ipfs/IPFSConnector";
import { delay } from "@/common";
import DAG from "@/ipfs/DAG";
import { randomPortsConfigAsync } from "@/ipfs/ipfsDefaultConfig";
import BlocksGetter from "@/../tests/demoData/BlockGetter";
import { Block } from "@/models/Block";
describe("btree", function () {
    beforeAll(async () => {
        logger.silent = false;
    });

    beforeEach(async () => {
        let config = await randomPortsConfigAsync();
        logger.info(JSON.stringify(config.config.Addresses));
        IPFSconnector.setConfig({
            ...config,
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
            const t = new BTree<number, object>(16);
            for (let i = 0; i <= 100; i++) {
                await t.insert(i, { ffffuha: i });
            }
            logger.info((await DAG.PutAsync(t.serialize())).toString());

        });

        it("create index from blocks", async () => {
            const blockGetter = new BlocksGetter(10);
            const heightIndex = new BTree<number, Block>(4);
            for await (let b of blockGetter) {
                const block = new Block(b);
                await heightIndex.insert(b.height, block);
            }

            console.log(await heightIndex.keys());
        });

        it("search range", async () => {
            const t = new BTree<number, object>(4);
            for (let i = 0; i <= 100; i++) {
                await t.insert(i, { ffffuha: i });
            }

            let results = await t.searchRange(50, 55)
            let curr = 50
            await results.traverseRange(50, 55, (i, v) => {
                expect(i).toBe(curr)
                expect(v).toStrictEqual({ ffffuha: curr })
                curr++
            })
        });

        it("get range", async () => {
            const t = new BTree<number, object>(4);
            for (let i = 0; i <= 100; i++) {
                await t.insert(i, { ffffuha: i });
            }

            let results = await t.getRange(50, 55)
            expect(results).toHaveLength(6)
            expect(await t.getRange(95, 97)).toHaveLength(3)
            expect(await t.getRange(0, 1)).toHaveLength(2)
            expect(await t.getRange(1, 0)).toHaveLength(0)
            expect(await t.getRange(-1, -10)).toHaveLength(0)
            expect(await t.getRange(200, 300)).toHaveLength(0)
        });

        it("get less", async () => {
            const t = new BTree<number, object>(4);
            for (let i = 0; i <= 100; i++) {
                await t.insert(i, { ffffuha: i });
            }

            let results = await t.getLess(3)
            expect(results).toHaveLength(3)
        });

        it("get greather", async () => {
            const t = new BTree<number, object>(4);
            for (let i = 0; i <= 100; i++) {
                await t.insert(i, { ffffuha: i });
            }

            let results = await t.getGreather(97)
            expect(results).toHaveLength(3)
        });
    });
});
