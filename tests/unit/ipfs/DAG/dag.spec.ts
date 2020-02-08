import IPFSconnector from "@/ipfs/IPFSConnector";
import logger from "@/logger";
import { randomPortsConfigAsync } from '@/ipfs/ipfsDefaultConfig';

logger.silent = true;

describe("dag", function () {
    beforeEach(async () => {
        let config = await randomPortsConfigAsync();
        logger.info(JSON.stringify(config.config.Addresses));
        IPFSconnector.setConfig({
            ...config,
            repo: "/.ipfsDagTests"
        });
        return await IPFSconnector.getInstanceAsync();
    });

    afterEach(async () => {
        return (await IPFSconnector.getInstanceAsync()).shutDownAsync();
    });

    describe("get", () => {
        it("should callback with error for invalid string CID input", async done => {
            (await IPFSconnector.getInstanceAsync()).node.dag.get(
                "INVALID CID",
                err => {
                    expect(err).toBeDefined();
                    expect(err.code).toEqual("ERR_INVALID_CID");
                    done();
                }
            );
        });

        it("should callback with error for invalid buffer CID input", async done => {
            (await IPFSconnector.getInstanceAsync()).node.dag.get(
                Buffer.from("INVALID CID"),
                err => {
                    expect(err).toBeDefined();
                    expect(err.code).toEqual("ERR_INVALID_CID");
                    done();
                }
            );
        });
    });

    describe("tree", () => {
        it("should callback with error for invalid CID input", async done => {
            (await IPFSconnector.getInstanceAsync()).node.dag.tree(
                "INVALID CID",
                err => {
                    expect(err).toBeDefined();
                    expect(err.code).toEqual("ERR_INVALID_CID");
                    done();
                }
            );
        });
    });
});
