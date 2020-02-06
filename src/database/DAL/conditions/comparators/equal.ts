import IComparator from "./IComparator";
import IndexStore from "../../indexes/indexStore";
import { BPlusTree } from "@/database/index/bTree/BTree";

export default class equal implements IComparator {
    value: any;
    property: any;
    btree: BPlusTree<any, any>;
    constructor(property, value, entityName) {
        this.property = property;
        this.value = value;
        this.btree = IndexStore.getIndex(entityName, property);
    }

    public test(val: any) {
        return val === this.value;
    }

    public async getIterator(btree: BPlusTree<any, any>) {
        let val = await btree.find(this.value);
        let wasCalledFirstTime = true;
        return {
            [Symbol.asyncIterator]: () => {
                return {
                    next: async () => {
                        if (val) {
                            return {
                                value: val,
                                done: wasCalledFirstTime = !wasCalledFirstTime
                            };
                        } else {
                            return {
                                done: true
                            };
                        }
                    }
                };
            }
        };
    }
}
