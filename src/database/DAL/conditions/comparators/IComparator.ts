import BTree from "../../../BTree/btree";

export default interface IComparator {
    property: any;
    test(value: any): boolean;
    traverse(btree: BTree<any, any>);
}
