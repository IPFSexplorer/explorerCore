import "reflect-metadata";

import ipfsBtreeNodeChildren from "../src/database/BTree/children/ipfsChildren";
import { container } from "tsyringe";
import Queriable from "../src/database/DAL/query/queriable";
import PrimaryKey from "../src/database/DAL/decorators/primaryKey";
import Index from "../src/database/DAL/decorators/index";
import Database from "../src/database/DAL/database/databaseStore";
import IPFSconnector from "../src/ipfs/IPFSConnector";
import { randomPortsConfigAsync } from "../src/ipfs/ipfsDefaultConfig";
import { DEFAULT_COMPARATOR } from "../src/database/BTree/btree";
import DBLog from "../src/database/DAL/database/DBLog";
import DatabaseInstance from "../src/database/DAL/database/databaseInstance";


class User extends Queriable<User> {
    @PrimaryKey()
    name: string;

    @Index()
    age: number;

    constructor(name, age)
    {
        super();
        this.name = name;
        this.age = age;
    }
}


class Numberr extends Queriable<Numberr> {
    @PrimaryKey()
    value: number;

    @Index(DEFAULT_COMPARATOR, (number) => number.value % 2)
    isOdd: boolean;
}



describe("Btree", () =>
{
    beforeAll(async () =>
    {
        IPFSconnector.setConfig(await randomPortsConfigAsync());
        container.register("BtreeNodeChildren", {
            useClass: ipfsBtreeNodeChildren
        });
    });

    it('use DB', async () =>
    {
        Database.connect("testDB", "user");
        await Database.use("testDB").execute(async (db) =>
        {
            const promises = [];
            for (let i = 0; i < 100; i++)
            {
                const n = new Numberr();
                n.value = i;
                promises.push(n.save());
            }

            await Promise.all(promises);

            const db1 = await Database.selectedDatabase.getLog();
            console.log(db1);
            await Database.selectedDatabase.syncLog(db1);
        });
    }, 500000);

    it('merge DBs', async () =>
    {
        Database.connect("testDB", "user");
        await Database.use("testDB").execute(async (db: DatabaseInstance) =>
        {
            await new User("test1", 1).save();
            const dbLog1 = await Database.selectedDatabase.getLog();

            await new User("test3", 2).save();
            const dbLog2 = await Database.selectedDatabase.getLog();


            Database.selectedDatabase.log = await DBLog.fromMultihash(db.identity, db.databaseName, dbLog1);
            Database.selectedDatabase.fromMultihash(Database.selectedDatabase.log.head.payload.database);

            await new User("aaaa", 3).save();
            await new User("test4", 7).save();
            await new User("test5", 4).save();
            await new User("test6", 5).save();
            await new User("test7", 6).save();

            await Database.selectedDatabase.syncLog(dbLog2);


            await db.waitForAllTransactionsDone();
            console.log(db.log.toString(p => p.transaction.data.name));

        });
    }, 500000);
});
