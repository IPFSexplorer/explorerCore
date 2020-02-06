import "reflect-metadata";
import logger from "@/logger";
import { BPlusTree } from "@/database/index/bTree/BTree";
import { container } from "tsyringe";
import LocalBTreeChildren from "@/database/index/bTree/local/LocalBTreeChildren";
import IPFSBTreeChildren from "@/database/index/bTree/ipfs/IPFSBTreeChildren";
import CID from "cids";
import DAG from "@/ipfs/DAG";
import IPFSconnector from "@/ipfs/IPFSConnector";
import getPort from "get-port";

describe("btree", function () {
    beforeAll(async () => {
        logger.silent = true;
        container.register("BTreeChildren", {
            useClass: LocalBTreeChildren
        });
    });

    describe("insert", () => {
        it("should create and insert elements to B+tree", async () => {
            const t = new BPlusTree<string, number>();
            await t.add("five", 5);
            expect(await t.find("five")).toBe(5);
        });

        it("should create and insert 1000 elements to B+tree", async () => {
            const t = new BPlusTree(4);
            for (let i = 0; i <= 30; i++) {
                await t.add(i, { ffffuha: i });
                //logger.info(await t.print());
            }

            for (let i = 0; i <= 30; i++) {
                //logger.info(i.toString());
                expect(await t.find(i)).toStrictEqual({ ffffuha: i });
            }

            expect(await t.find(1001)).toBeNull();
        });

        it("should find previous and next leaf", async () => {
            let branchFactor = 4;
            const t = new BPlusTree(branchFactor);
            for (let i = 0; i <= 100; i++) {
                await t.add(i, { ffffuha: i });
            }

            for (let i = 4; i <= 96; i++) {
                let node = await t.findLeaf(i);
                expect(node.previousNode.nextNode).toStrictEqual(node);
                expect(node.nextNode.previousNode).toStrictEqual(node);
            }
        });
    });
});

describe("btreeIPFS", function () {
    beforeAll(async done => {
        container.register("BTreeChildren", {
            useClass: IPFSBTreeChildren
        });
        logger.silent = true;
        IPFSconnector.setConfig({
            repo: "/.ipfsBtreeTests",
            config: {
                Addresses: {
                    Swarm: [
                        "/ip4/0.0.0.0/tcp/" + (await getPort()),
                        "/ip4/127.0.0.1/tcp/" + (await getPort()) + "/ws",
                        "/dns4/xxx/tcp/9090/ws/p2p-webrtc-star"
                    ],
                    API: "/ip4/127.0.0.1/tcp/" + (await getPort()),
                    Gateway: "/ip4/127.0.0.1/tcp/" + (await getPort())
                }
            }
        });
        done();
    });

    afterEach(async done => {
        await (await IPFSconnector.getInstanceAsync()).shutDownAsync();
        done();
    });

    describe("insert", () => {
        it("should create and insert elements to B+tree", async () => {
            const t = new BPlusTree<string, CID>();
            const cid = await DAG.PutAsync(5);
            await t.add("five", cid.toString());
            expect(await t.find("five")).toBe(cid.toString());
        });

        it("should create and insert 1000 elements to B+tree", async () => {
            const t = new BPlusTree(4);
            for (let i = 0; i <= 30; i++) {
                await t.add(i, { ffffuha: i });
                logger.info(await t.print());
            }

            for (let i = 0; i <= 30; i++) {
                logger.info(i.toString());
                expect(await t.find(i)).toStrictEqual({ ffffuha: i });
            }

            expect(await t.find(1001)).toBeNull();
        });

        it("should find previous and next leaf", async () => {
            let branchFactor = 4;
            const t = new BPlusTree(branchFactor);
            for (let i = 0; i <= 100; i++) {
                await t.add(i, { ffffuha: i });
            }

            for (let i = 4; i <= 96; i++) {
                let node = await t.findLeaf(i);
                expect(node.previousNode.nextNode).toStrictEqual(node);
                expect(node.nextNode.previousNode).toStrictEqual(node);
            }
        });
    });
});
