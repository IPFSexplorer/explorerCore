import IComparator from "./IComparator";
import BTree from "../../../BTree/btree";
import { Filter } from "../../query/types";
import Database from "../../database/database";
export default class equal implements IComparator {
    value: any;
    property: any;
    btree: BTree<any, any>;
    constructor(property, value, entityName) {
        this.property = property;
        this.value = value;
        this.btree = Database.getTable(entityName).getIndex(property);
    }

    public getFilter(): Filter<any> {
        return (e => e[this.property] === this.value).bind(this);
    }

    public async *traverse(btree: BTree<any, any>) {
        const res = await btree.get(this.value);
        if (res != null) yield res;
    }
}
