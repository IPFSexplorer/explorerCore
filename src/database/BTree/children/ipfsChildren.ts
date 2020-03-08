import IBtreeNodeChildren from "./Ichildren";
import BTreeNode from "../btree_node";
import { Value, Key } from "../types";
import DAG from "../../../ipfs/DAG";
import CID from "cids";
import { Serialize, inflate } from "serialazy";
import SerializeAnArrayOf from "../../serialization/arraySerializer";

export default class ipfsBtreeNodeChildren implements IBtreeNodeChildren
{

    @SerializeAnArrayOf(CID) items: Array<string>;

    constructor()
    {
        this.items = [];
    }

    async getChild(idx: number): Promise<BTreeNode<Key, Value>>
    {
        // TODO: serialazy!!!
        let nodeData = await DAG.GetAsync(this.items[idx]);
        return inflate(BTreeNode, nodeData);
    }

    async setChild(node: BTreeNode<Key, Value>, idx: number): Promise<void>
    {
        this.items[idx] = (await DAG.PutAsync(node)).toString();
    }

}