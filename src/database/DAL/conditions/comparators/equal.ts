import IComparator from "./IComparator";
import IndexStore from "../../indexes/indexStore";
import BTree from "../../../BTree/btree";
import { Filter } from "../../query/types";
export default class equal implements IComparator {
    value: any;
    property: any;
    btree: BTree<any, any>;
    constructor(property, value, entityName) {
        this.property = property;
        this.value = value;
        this.btree = IndexStore.getIndex(entityName, property);
    }

    public getFilter(): Filter<any> {
        return (e => e[this.property] === this.value).bind(this);
    }

    public async *traverse(btree: BTree<any, any>) {
        const res = await btree.get(this.value);
        if (res != null) yield res;
    }
}
