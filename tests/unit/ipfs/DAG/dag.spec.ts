import IPFSconnector from "@/ipfs/IPFSConnector";
import logger from "@/logger";

logger.silent = true;

describe("dag", function() {
    beforeEach(async () => {
        IPFSconnector.setConfig({
            repo: "/.ipfsDagTests"
        });
        return await IPFSconnector.getInstanceAsync();
    });

    afterEach(async () => {
        return (await IPFSconnector.getInstanceAsync()).shutDown();
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
