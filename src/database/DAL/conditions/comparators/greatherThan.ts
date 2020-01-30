import IComparator from "./IComparator";
import IndexStore from "../../indexes/indexStore";
import { BPlusTree } from "@/database/index/bTree/BTree";
import { Child } from "@/database/index/bTree/Interfaces";

export default class greatherThan implements IComparator {
    value: any;
    property: any;
    btree: BPlusTree<any, any>;
    constructor(property, value, entityName) {
        this.property = property;
        this.value = value;
        this.btree = IndexStore.getIndex(entityName, property);
    }

    public test(val: any) {
        return val > this.value;
    }

    public getIterator(btree: BPlusTree<any, any>) {
        return btree.traverseRight(this.value);
    }
}
