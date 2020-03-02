import DBLog from "../database/DBLog";
import BTree from "../../BTree/BTree";

export default class Table {
    public name: string;
    private indexes: { [property: string]: BTree<any, any> };
    private primaryIndex: string


    constructor(name: string) {
        this.name = name
        this.indexes = {}
    }

    public async insert(entity) {
        const promises = []

        // TODO save entity to IPFS
        for (const key in this.indexes) {
            promises.push(this.getIndex(key).save(entity))
        }

        // TODO return only CID of saved entity
        return await Promise.all(promises)
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