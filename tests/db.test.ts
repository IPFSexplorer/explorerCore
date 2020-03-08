import "reflect-metadata";

import ipfsBtreeNodeChildren from "../src/database/BTree/children/ipfsChildren";
import { container } from "tsyringe";
import Queriable from "../src/database/DAL/query/queriable";
import PrimaryKey from "../src/database/DAL/decorators/primaryKey";
import Index from "../src/database/DAL/decorators/index";
import Database from "../src/database/DAL/database/databaseStore";
import IPFSconnector from "../src/ipfs/IPFSConnector";
import { randomPortsConfigAsync } from "../src/ipfs/ipfsDefaultConfig";


class User extends Queriable<User> {
    @PrimaryKey()
    name: string;

    @Index()
    age: number;
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
        Database.connectOrCreate("testDB", "user");
        await Database.use("testDB").execute(async (db) =>
        {
            const u = new User();
            u.name = "Matus";
            u.age = 22;
            await u.save();

            const db1 = await Database.selectedDatabase.getLog();
            console.log(db1);
            await Database.selectedDatabase.syncLog(db1);
        });
    }, 500000);
});