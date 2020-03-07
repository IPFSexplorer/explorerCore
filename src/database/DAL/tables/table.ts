import BTree from "../../BTree/BTree";
import { Serialize } from "serialazy";
import SerializeAnObjectOf from "../../serialization/objectSerializer";
import { write } from "../../log/io";

export default class Table {
    @Serialize() public name: string;
    @SerializeAnObjectOf(BTree) private indexes: { [property: string]: BTree<any, any> };
    @Serialize() private primaryIndex: string


    constructor(name: string, indexes, primaryKey: string) {
        this.name = name
        this.indexes = {}
        for (const property in indexes) {
            this.indexes[property] = new BTree(
                indexes[property].branching,
                indexes[property].comparator,
                indexes[property].keyGetter
            )
        }
        this.primaryIndex = primaryKey
    }

    public async insert(entity) {
        const promises = []

        const cid = write("dag-json", entity)
        for (const key in this.indexes) {
            promises.push(this.getIndex(key).save(cid))
        }

        await Promise.all(promises)
        return cid
    }


    public hasIndex(property: string): Boolean {
        return this.indexes.hasOwnProperty(property);
    }

    public getIndex(property: string): BTree<any, any> {
        if (this.indexes[property] === undefined) return null;
        return this.indexes[property];
    }

    public getPrimaryIndex() {
        return this.indexes[this.primaryIndex];
    }

    public addIndex(property: string, index: BTree<any, any>) {
        this.indexes[property] = index;
    }

    public setPrimary(property) {
        this.primaryIndex = property;
    }
}