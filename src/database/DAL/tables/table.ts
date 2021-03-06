import BTree from "../../BTree/BTree";
import { Serialize, inflate, deflate } from "serialazy";
import SerializeAnObjectOf from "../../serialization/objectSerializer";
import { write } from "../../log/io";
import Queriable from "../query/queriable";
import DAG from "../../../ipfs/DAG";
import Log from "../../log/log";
import DatabaseInstance from "../database/databaseInstance";
import { TimeMeaseure } from "../../../common";

export default class Table {
    @Serialize() public name: string;
    @SerializeAnObjectOf(BTree) public indexes: {
        [property: string]: BTree<any, any>;
    };
    @Serialize() public primaryIndex: string;

    constructor(init?: Partial<Table>) {
        Object.assign(this, init);
    }

    public async insert(entity: Queriable<any>, cid) {
        //const timeMeaseure = TimeMeaseure.start("insert");
        const promises = [];

        for (const property in this.indexes) {
            const index = this.getIndex(property);
            const key = index.keyGetter(entity);

            if (Array.isArray(key)) {
                promises.push(index.insertArray(key, cid));
            } else {
                promises.push(index.insert(key, cid));
            }
        }

        await Promise.all(promises);
        //timeMeaseure.stop();
        return cid;
    }

    public async delete(entity: Queriable<any>) {
        const promises = [];

        for (const key in this.indexes) {
            const index = this.getIndex(key);
            promises.push(index.remove(index.keyGetter(entity)));
        }

        await Promise.all(promises);
        return;
    }

    public async update(entity: Queriable<any>, cid) {
        const promises = [];

        for (const key in this.indexes) {
            const index = this.getIndex(key);

            promises.push(index.remove(index.keyGetter(entity)));
            promises.push(index.insert(index.keyGetter(entity), cid));
        }

        await Promise.all(promises);
        return cid;
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
