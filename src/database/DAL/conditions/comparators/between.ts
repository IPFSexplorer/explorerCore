import IComparator from "./IComparator";
import IndexStore from "../../indexes/indexStore";
import { BPlusTree } from "@/database/index/bTree/BTree";

export default class between implements IComparator {
    min: any;
    max: any;
    property: any;
    btree: BPlusTree<any, any>;
    constructor(property, { min, max }, entityName) {
        this.property = property;
        this.min = min;
        this.max = max;
        this.btree = IndexStore.getIndex(entityName, property);
    }

    public test(val: any) {
        return val > this.min && val < this.max;
    }

    public async getIterator(btree: BPlusTree<any, any>) {
        return await btree.traverseRight(this.min);
    }
}
