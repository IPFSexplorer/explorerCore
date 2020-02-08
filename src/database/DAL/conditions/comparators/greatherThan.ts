import IComparator from "./IComparator";
import IndexStore from "../../indexes/indexStore";
import BTree from "@/database/index/bTree/BTree";

export default class greatherThan implements IComparator {
    value: any;
    property: any;
    btree: BTree<any, any>;
    constructor(property, value, entityName) {
        this.property = property;
        this.value = value;
        this.btree = IndexStore.getIndex(entityName, property);
    }

    public test(val: any) {
        return val > this.value;
    }

    public async traverse(btree: BTree<any, any>) {
        const subtree = await btree.sea(this.value);
        await subtree.traverseGreather(
            this.value,
            (key: Key, value: Value) => values.push(value),
            btree.comparator
        );
    }
}
