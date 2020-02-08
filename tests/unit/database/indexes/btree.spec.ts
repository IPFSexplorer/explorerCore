import logger from "@/logger";
import BTree from "@/database/index/BTree/btree";
import IPFSconnector from "@/ipfs/IPFSConnector";
import { delay } from "@/common";
import DAG from "@/ipfs/DAG";
import { randomPortsConfigAsync } from "@/ipfs/ipfsDefaultConfig";
import BlocksGetter from "@/../tests/demoData/BlockGetter";
import { Block } from "@/models/Block";
import CID from "cids";
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
            await t.insert(5, "five");
            expect((await t.keys())[0]).toBe(5);
        });

        it("create index from blocks", async () => {
            const blockGetter = new BlocksGetter(10);
            const heightIndex = new BTree<number, Block>(4);
            for await (let b of blockGetter) {
                const block = new Block(b);
                await heightIndex.insert(b.height, block);
            }
        });

        it("get range", async () => {
            const t = new BTree<number, object>(4);
            for (let i = 0; i <= 100; i++) {
                await t.insert(i, { ffffuha: i });
            }

            let results = await t.getRange(50, 55);
            expect(results).toHaveLength(6);
            expect(await t.getRange(95, 97)).toHaveLength(3);
            expect(await t.getRange(0, 1)).toHaveLength(2);
            expect(await t.getRange(1, 0)).toHaveLength(0);
            expect(await t.getRange(-1, -10)).toHaveLength(0);
            expect(await t.getRange(200, 300)).toHaveLength(0);
        });

        it("get less", async () => {
            const t = new BTree<number, object>(4);
            for (let i = 0; i <= 100; i++) {
                await t.insert(i, { ffffuha: i });
            }

            let results = await t.getLess(3);
            expect(results).toHaveLength(3);
        });

        it("get greather", async () => {
            const t = new BTree<number, object>(4);
            for (let i = 0; i <= 100; i++) {
                await t.insert(i, { ffffuha: i });
            }

            let results = await t.getGreather(97);
            expect(results).toHaveLength(3);
        });

        it("get equal", async () => {
            const t = new BTree<number, object>(4);
            for (let i = 0; i <= 100; i++) {
                await t.insert(i, { ffffuha: i });
            }

            let result = await DAG.GetAsync((await t.get(97)) as CID);
            expect(result).toStrictEqual({ ffffuha: 97 });
        });
    });
});
