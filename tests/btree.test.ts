import "reflect-metadata";

import localBtreeNodeChildren from "../src/database/BTree/children/localChildren";
import BTree from "../src/database/BTree/BTree";
import { container } from "tsyringe";
import ipfsBtreeNodeChildren from "../src/database/BTree/children/ipfsChildren";


describe("Btree", () =>
{
    beforeAll(() =>
    {
        container.register("BtreeNodeChildren", {
            useClass: ipfsBtreeNodeChildren
        });
    });

    it('insert to values to btree', async () =>
    {
        const t = new BTree();
        for (let i = 0; i < 100; i++)
        {
            await t.insert(i, { name: "test object", value: i });
        }

        for (let i = 0; i < 100; i++)
        {
            expect(await t.get(i)).toStrictEqual({ name: "test object", value: i });
        }

        expect(await t.get(101)).toBe(null);
    });
});