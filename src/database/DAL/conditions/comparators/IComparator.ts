import { Node, Child } from "@/database/index/bTree/Interfaces";
import { BPlusTree } from "@/database/index/bTree/BTree";

export default interface IComparator {
    value: any;
    property: any;
    test(value: any): boolean;
    getIterator(btree: BPlusTree<any, any>);
}
