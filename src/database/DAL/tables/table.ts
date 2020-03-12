import BTree from "../../BTree/BTree";
import { Serialize } from "serialazy";
import SerializeAnObjectOf from "../../serialization/objectSerializer";
import { write } from "../../log/io";
import Queriable from "../query/queriable";

export default class Table
{
    @Serialize() public name: string;
    @SerializeAnObjectOf(BTree) public indexes: { [property: string]: BTree<any, any>; };
    @Serialize() public primaryIndex: string;


    constructor(init?: Partial<Table>)
    {
        Object.assign(this, init);
    }

    public async insert(entity: Queriable<any>)
    {
        const promises = [];

        // TODO change this to dag-json after https://github.com/ipld/js-dag-json/issues/24 is resolved
        if (entity.toJson)
            entity = entity.toJson() as unknown as Queriable<any>;
        const cid = await write("dag-json", entity);
        for (const key in this.indexes)
        {
            const index = this.getIndex(key);
            promises.push(index.insert(index.keyGetter(entity), cid));
        }

        await Promise.all(promises);
        return cid;
    }


    public hasIndex(property: string): Boolean
    {
        return this.indexes.hasOwnProperty(property);
    }

    public getIndex(property: string): BTree<any, any>
    {
        if (this.indexes[property] === undefined) return null;
        return this.indexes[property];
    }

    public getPrimaryIndex()
    {
        return this.indexes[this.primaryIndex];
    }

    public addIndex(property: string, index: BTree<any, any>)
    {
        this.indexes[property] = index;
    }

    public setPrimary(property)
    {
        this.primaryIndex = property;
    }
}