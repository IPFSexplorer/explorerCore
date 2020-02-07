import { Node, BTreeChildren } from "@/database/index/bTree/Interfaces";
import DAG from "@/ipfs/DAG";
import CID from "cids";
export default class IPFSBtreeNode<K, V> implements Node<K, V> {
    isLeaf?: boolean;
    children: BTreeChildren<K, V>;

    constructor(data = null) {
        if (data) {
            this.isLeaf = data["isLeaf"];
            this.children = data["children"];
        }
    }
}
