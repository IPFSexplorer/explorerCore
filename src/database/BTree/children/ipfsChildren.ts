import IBtreeNodeChildren from "./Ichildren";
import BTreeNode from "../btree_node";
import { Value, Key } from "../types";
import DAG from "../../../ipfs/DAG";
import CID from "cids";
import { Serialize } from "serialazy";

export default class ipfsBtreeNodeChildren implements IBtreeNodeChildren {

    @Serialize() items: Array<CID>

    constructor() {
        this.items = []
    }

    async getChild(idx: number): Promise<BTreeNode<Key, Value>> {
        // TODO: serialazy!!!
        let nodeData = await DAG.GetAsync(this.items[idx]);
        let node = new BTreeNode<Key, Value>();
        node.leaf = nodeData.leaf;
        node.keys = nodeData.keys;
        node.data = nodeData.data;
        node.n = nodeData.n;
        node.children = nodeData.children;
        return node;
    }

    async setChild(node: BTreeNode<Key, Value>, idx: number): Promise<void> {
        this.items[idx] = await DAG.PutAsync(node);
    }

}