
import Log from "../src/database/log/log"
import IdentityProvider from "orbit-db-identity-provider"
import Keystore from 'orbit-db-keystore';

describe("Log", () => {

    it('should create log', async () => {
        const identity = await IdentityProvider.createIdentity({ id: 'peerid' })
        const log = new Log(identity)

        // const promises = []
        for (let i = 0; i <= 1000; i++) {
            await log.append({ some: i })
            //promises.push(log.append({ some: i }))
        }

        // await Promise.all(promises)
        expect(log.values.length === 1000)
    });


    it('merge log', async () => {

        const keystore = new Keystore("logtests")
        const signingKeystore = new Keystore("logtestss")

        const testIdentity = await IdentityProvider.createIdentity({ id: 'userC', keystore, signingKeystore })
        const testIdentity2 = await IdentityProvider.createIdentity({ id: 'userB', keystore, signingKeystore })
        const testIdentity3 = await IdentityProvider.createIdentity({ id: 'userD', keystore, signingKeystore })
        const testIdentity4 = await IdentityProvider.createIdentity({ id: 'userA', keystore, signingKeystore })


        const log1 = new Log(testIdentity, { logId: 'X' })
        const log2 = new Log(testIdentity2, { logId: 'X' })
        const log3 = new Log(testIdentity3, { logId: 'X' })
        const log4 = new Log(testIdentity4, { logId: 'X' })

        await log1.append('helloA1')
        await log1.append('helloA2')
        console.log(log1.toString())
        await log2.append('helloB1')
        await log2.append('helloB2')
        await log1.join(log2)
        console.log(log1.toString())
        console.log(log2.toString())

        for (let i = 0; i < 10; i++) {
            await log3.append(i)
        }
        const diff = Log.difference(log2, log1)
        console.log(log1.toJSON())
        console.log(log3.toJSON())
    });
})