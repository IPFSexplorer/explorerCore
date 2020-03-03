import "reflect-metadata";

import localBtreeNodeChildren from "../src/database/BTree/children/localChildren";
import BTree from "../src/database/BTree/BTree";
import { container } from "tsyringe";

import DBentity from "../src/database/DAL/query/DBentity"
import primaryKey from "../src/database/DAL/decorators/primaryKey"
import index from "../src/database/DAL/decorators/index"
import DatabaseInstance from "../src/database/DAL/database/database";

class User extends DBentity<User> {
    @primaryKey()
    name: string

    @index()
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
})