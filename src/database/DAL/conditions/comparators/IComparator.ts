import BTree from "@/database/BTree/BTree";

export default interface IComparator {
    property: any;
    test(value: any): boolean;
    traverse(btree: BTree<any, any>);
}
