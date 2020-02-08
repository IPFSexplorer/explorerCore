import IComparator from "./IComparator";
import IndexStore from "../../indexes/indexStore";
import BTree from "@/database/index/bTree/BTree";

export default class equal implements IComparator {
    value: any;
    property: any;
    btree: BTree<any, any>;
    constructor(property, value, entityName) {
        this.property = property;
        this.value = value;
        this.btree = IndexStore.getIndex(entityName, property);
    }

    public test(val: any) {
        return val === this.value;
    }

    public async traverse(btree: BTree<any, any>) {
        // let val = await btree.search(this.value);
        // let wasCalledFirstTime = true;
        // return {
        //     [Symbol.asyncIterator]: () => {
        //         return {
        //             next: async () => {
        //                 if (val) {
        //                     return {
        //                         value: val,
        //                         done: wasCalledFirstTime = !wasCalledFirstTime
        //                     };
        //                 } else {
        //                     return {
        //                         done: true
        //                     };
        //                 }
        //             }
        //         };
        //     }
        // };
    }
}
