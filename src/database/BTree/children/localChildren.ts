import IBtreeNodeChildren from "./Ichildren";
import BTreeNode from "../btree_node";
import { Value, Key } from "../types";

export default class localBtreeNodeChildren implements IBtreeNodeChildren {

    items: Value[];

    constructor() {
        this.items = []
    }

    async getChild(idx: number): Promise<BTreeNode<Key, Value>> {
        return this.items[idx];
    }

    async setChild(node: BTreeNode<Key, Value>, idx: number): Promise<void> {
        this.items[idx] = node;
    }

}