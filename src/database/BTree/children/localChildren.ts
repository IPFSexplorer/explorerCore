import IBtreeNodeChildren from "./Ichildren";
import BTreeNode from "../btree_node";
import { Value, Key } from "../types";
import { Serialize } from "serialazy";

export default class localBtreeNodeChildren implements IBtreeNodeChildren {

    @Serialize.Custom({
        down: (items: Array<Value>) => items,
        up: (items: Array<any>) => items,
    })
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