import "reflect-metadata";

import ipfsBtreeNodeChildren from "../src/database/BTree/children/ipfsChildren";
import { container } from "tsyringe";
import Queriable from "../src/database/DAL/query/queriable"
import PrimaryKey from "../src/database/DAL/decorators/primaryKey"
import Index from "../src/database/DAL/decorators/index"
import Database from "../src/database/DAL/database/databaseStore";


class User extends Queriable<User> {
    @PrimaryKey()
    name: string

    @Index()
    age: number
}

describe("Btree", () => {
    beforeAll(() => {
        container.register("BtreeNodeChildren", {
            useClass: ipfsBtreeNodeChildren
        });
    })
    it('db create table', async () => {
        const u = new User()
        u.name = "Matus"
        u.age = 22
        await u.save()
    });

    it('use DB', async () => {
        Database.connectOrCreate("testDB", "user")
        Database.use("testDB").execute(async () => {
            const u = new User()
            u.name = "Matus"
            u.age = 22
            await u.save()

            const db1 = Database.selectedDatabase.getLog()
            console.log(db1)
            const db2 = await Database.selectedDatabase.syncLog(db1)
            console.log(db2)
        })
    }, 500000);
})