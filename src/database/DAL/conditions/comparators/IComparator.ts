import BTree from "../../../BTree/Btree";
import { Filter } from "../../query/types";

export default interface IComparator {
    property: any;
    getFilter(): Filter<any>;
    traverse(btree: BTree<any, any>);
}
