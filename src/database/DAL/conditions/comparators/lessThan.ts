import IComparator from "./IComparator";
import BTree from "../../../BTree/btree";
import { Filter } from "../../query/types";
import Database from "../../database/database";

export default class lessThan implements IComparator {
    value: any;
    property: any;
    btree: BTree<any, any>;
    constructor(property, value, entityName) {
        this.property = property;
        this.value = value;
        this.btree = Database.getTable(entityName).getIndex(property);
    }

    public getFilter(): Filter<any> {
        return e => e[this.property] < this.value;
    }

    public async traverse(btree: BTree<any, any>) {
        return btree.generatorLess(this.value);
    }
}
