import Log from "../src/database/log/log"
import IdentityProvider from "orbit-db-identity-provider"
import IPFS from "ipfs";
import IPFSconnector from "../src/ipfs/IPFSConnector";

describe("Log", () => {
    beforeAll(async () => {
        await IPFSconnector.getInstanceAsync()
    })

    it('should create log', async () => {
        const identity = await IdentityProvider.createIdentity({ id: 'peerid' })
        const log = new Log(identity)
        await log.append({ some: 'data' })
        await log.append('text')
        console.log(log.values.map(e => e.payload))
    }, 999999999);
})