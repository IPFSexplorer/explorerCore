import IComparator from "./IComparator";
import IndexStore from "../../indexes/indexStore";
import BTree from "../../../BTree/btree";
import { Filter } from "../../query/types";

export default class greatherThan implements IComparator {
    value: any;
    property: any;
    btree: BTree<any, any>;
    constructor(property, value, entityName) {
        this.property = property;
        this.value = value;
        this.btree = IndexStore.getIndex(entityName, property);
    }

    public getFilter(): Filter<any> {
        return e => e > this.value;
    }

    public async traverse(btree: BTree<any, any>) {
        return btree.generatorGreather(this.value);
    }
}
