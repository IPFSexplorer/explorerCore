import BTree from "../../../BTree/BTree";
import { Filter } from "../../query/types";

export default interface IComparator {
    property: any;
    getFilter(): Filter<any>;
    traverse(btree: BTree<any, any>);
}
