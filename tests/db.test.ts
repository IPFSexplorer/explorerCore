import "reflect-metadata";

import localBtreeNodeChildren from "../src/database/BTree/children/localChildren";
import BTree from "../src/database/BTree/BTree";
import { container } from "tsyringe";

import Queriable from "../src/database/DAL/query/queriable"
import PrimaryKey from "../src/database/DAL/decorators/primaryKey"
import DatabaseEntity from "../src/database/DAL/decorators/DatabaseEntity"
import Index from "../src/database/DAL/decorators/index"
import DatabaseInstance from "../src/database/DAL/database/databaseInstance";
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
            useClass: localBtreeNodeChildren
        });
    })
    it('db create table', async () => {
        const u = new User()
        u.name = "Matus"
        u.age = 22
        await u.save()
    });

    it('use DB', async () => {
        new User()
    });
})