import BTree from "../../BTree/BTree";
import { Serialize, inflate, deflate } from "serialazy";
import SerializeAnObjectOf from "../../serialization/objectSerializer";
import { write } from "../../log/io";
import Queriable from "../query/queriable";
import DAG from "../../../ipfs/DAG";
import Log from "../../log/log";
import DatabaseInstance from "../database/databaseInstance";

export default class Table {
    @Serialize() public name: string;
    @SerializeAnObjectOf(BTree) public indexes: {
        [property: string]: BTree<any, any>;
    };
    @Serialize() public primaryIndex: string;

    constructor(init?: Partial<Table>) {
        Object.assign(this, init);
    }

    public async insert(entity: Queriable<any>, identity) {
        const promises = [];

        const log = new Log(identity, {
            logId: this.getPrimaryIndex().keyGetter(entity),
        });
        await log.append(entity);

        const cid = await log.toMultihash();
        for (const key in this.indexes) {
            const index = this.getIndex(key);
            promises.push(index.insert(index.keyGetter(entity), cid));
        }

        await Promise.all(promises);
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

    public async update(entity: Queriable<any>) {
        const promises = [];

        const log = await entity.history();
        await log.append(entity);

        const cid = await log.toMultihash();
        for (const key in this.indexes) {
            const index = this.getIndex(key);

            // Update only changed indexes
            if (index.keyGetter(entity) != index.keyGetter((await log.get(entity.entryHash)).payload)) {
                promises.push(index.remove(index.keyGetter(entity)));
                promises.push(index.insert(index.keyGetter(entity), cid));
            } else {
                // TODO: update index key with new cid
                // promises.push(index.update())
            }
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
