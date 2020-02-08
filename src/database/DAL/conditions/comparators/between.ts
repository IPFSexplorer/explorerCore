import IComparator from "./IComparator";
import IndexStore from "../../indexes/indexStore";
import BTree from "@/database/index/bTree/BTree";

export default class between implements IComparator {
    min: any;
    max: any;
    property: any;
    btree: BTree<any, any>;
    constructor(property, { min, max }, entityName) {
        this.property = property;
        this.min = min;
        this.max = max;
        this.btree = IndexStore.getIndex(entityName, property);
    }

    public test(val: any) {
        return val > this.min && val < this.max;
    }

    public async traverse(btree: BTree<any, any>) {
        return btree.generatorRange(this.min, this.max);
    }
}
