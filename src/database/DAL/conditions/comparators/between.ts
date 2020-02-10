import IComparator from "./IComparator";
import IndexStore from "../../indexes/indexStore";
import BTree from "../../../BTree/btree";
import { Filter } from "../../query/types";

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

    public getFilter(): Filter<any> {
        return e => e[this.property] > this.min && e[this.property] < this.max;
    }

    public async traverse(btree: BTree<any, any>) {
        return btree.generatorRange(this.min, this.max);
    }
}
