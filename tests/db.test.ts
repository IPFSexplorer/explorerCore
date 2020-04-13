import Queriable from "../src/database/DAL/query/queriable";
import PrimaryKey from "../src/database/DAL/decorators/primaryKey";
import Index from "../src/database/DAL/decorators/index";
import Database from "../src/database/DAL/database/databaseStore";
import IPFSconnector from "../src/ipfs/IPFSConnector";
import { randomPortsConfigAsync } from "../src/ipfs/ipfsDefaultConfig";
import { DEFAULT_COMPARATOR } from "../src/database/BTree/BTree";
import DatabaseInstance from "../src/database/DAL/database/databaseInstance";
import IdentityProvider from "orbit-db-identity-provider";
import { delay, TimeMeaseure } from "../src/common";
import ForeignKey from "../src/database/DAL/foreignKey";
import logger from "../src/logger";

class User extends Queriable<User> {
    @PrimaryKey()
    name: string;

    @Index(undefined, undefined, 3)
    age: number;

    toString() {
        return this.age;
    }
}

class Numberr extends Queriable<Numberr> {
    @PrimaryKey()
    value: number;

    @Index(DEFAULT_COMPARATOR, (number) => number.value % 2)
    isOdd: boolean;
}

describe("Btree", () => {
    beforeAll(async () => {
        IPFSconnector.setConfig({
            ...(await randomPortsConfigAsync()),
            repo: "C:\\DP\\benchmarks",
        });
    });
    it("time measure", () => {
        const tm = TimeMeaseure.start("test");
        console.log(tm.stop());
        console.log("" + tm.stop());
    });

    it("refactor test", async () => {
        const id = (await (await IPFSconnector.getInstanceAsync()).node.id()).id;
        const identity = await IdentityProvider.createIdentity({
            id,
        });
        Database.connect("testDB", identity);
        await Database.use("testDB").execute(async (db1: DatabaseInstance) => {
            Database.selectedDatabase.getOrCreateTableByEntity(new User());
            let tasks = [];
            const tm = TimeMeaseure.start("whole");
            for (let i = 0; i < 5000; i++) {
                const u = new User();
                u.name = "test" + i;
                u.age = i;
                tasks.push(u.save());
                if (tasks.length === 100) {
                    await Promise.all(tasks);
                    tasks = [];
                    console.log("done " + i);
                }
            }

            await Promise.all(tasks);
            tm.stop();
            await TimeMeaseure.print();
            const users = await Promise.all(await new User().all());
        });
    }, 5000000);

    // it('FK test', async () =>
    // {
    //     const n = new Numberr();
    //     n.value = 22;

    //     const u = new User("matus", 10);
    //     u.age = new ForeignKey<Numberr>();
    //     u.age.set(n);

    //     console.log(await u.age.get());
    // });

    it("use DB", async () => {
        Database.connect("testDB", "user");
        await Database.use("testDB").execute(async (db) => {
            const promises = [];
            for (let i = 0; i < 100; i++) {
                const n = new Numberr();
                n.value = i;
                promises.push(n.save());
            }

            await Promise.all(promises);

            const db1 = await Database.selectedDatabase;
            console.log(db1);
        });
    }, 500000);
});
