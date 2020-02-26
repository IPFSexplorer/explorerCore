import BTreeNode from "../btree_node";
import { Value, Key } from "../types";

export default interface IBtreeNodeChildren {

    items: Array<any>

    getChild(idx: number): Promise<BTreeNode<Key, Value>>;

    setChild(node: BTreeNode<Key, Value>, idx: number): Promise<void>;
}