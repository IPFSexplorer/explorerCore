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
import DatabaseInstance from "../src/database/DAL/database/databaseInstance";
import IdentityProvider from "orbit-db-identity-provider";
import { delay } from "../src/common";
import ForeignKey from "../src/database/DAL/foreignKey";


class User extends Queriable<User> {
    @PrimaryKey()
    name: string;


    age: ForeignKey<Numberr>;

    constructor(name, age)
    {
        super();
        this.name = name;
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

    it('FK test', async () =>
    {
        const n = new Numberr();
        n.value = 22;

        const u = new User("matus", 10);
        u.age = new ForeignKey<Numberr>();
        u.age.set(n);


        console.log(await u.age.get());
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

            const db1 = await Database.selectedDatabase;
            console.log(db1);
        });
    }, 500000);

    it('merge DBs', async () =>
    {
        const identity = await IdentityProvider.createIdentity({ id: "userA" });
        Database.connect("testDB", identity);

        await Database.use("testDB").execute(async (db1: DatabaseInstance) =>
        {
            await new User("test1", 1).save();
            await new User("test2", 2).save();
            await new User("testA1", 3).save();
            await new User("testA2", 4).save();

            await db1.waitForAllTransactionsDone();
            console.log(db1.log.toString(p => p.transaction.data.name));

            Database.connect("testDB", identity);
            await Database.use("testDB").execute(async (db2: DatabaseInstance) =>
            {
                await new User("test1", 1).save();
                await new User("test2", 2).save();
                await new User("testB1", 3).save();
                await new User("testB2", 4).save();

                await db2.waitForAllTransactionsDone();


                await delay(3000);

                console.log(db2.log.toString(p => p.transaction.data.name));
                console.log(db1.log.toString(p => p.transaction.data.name));

                let head = db2.log.head;
                while (head)
                {
                    console.log(head.payload.transaction.data.name);
                    head = db2.log.get(head.payload.parent);
                }

            });
        });



    }, 500000);
});
