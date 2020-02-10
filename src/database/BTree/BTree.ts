import { Comparator, Key, Value, Visitor, KeyGetter } from "./types";
import BTreeNode from "./btree_node";
import DAG from "../../ipfs/DAG";
import { makeFunctionFromString } from "../../common";

export const DEFAULT_COMPARATOR: Comparator<Key> = (a: Key, b: Key) => a - b;
export const DEFAULT_KEY_GETTER: KeyGetter<Value, Key> = (a: Value) => a.id;

export default class BTree<Key, Value> {
    private root?: BTreeNode<Key, Value>;

    private t: number;

    public comparator: Comparator<Key>;

    public keyGetter: KeyGetter<Value, Key>;

    private size: number;

    constructor(
        t: number = 8,
        comparator: Comparator<Key> = DEFAULT_COMPARATOR,
        keyGetter: KeyGetter<Value, Key> = DEFAULT_KEY_GETTER
    ) {
        this.root = null; // Pointer to root node
        this.t = t; // Minimum degree
        this.comparator = comparator;
        this.keyGetter = keyGetter;
        this.size = 0;
    }

    async traverse(visitor: Visitor<Key, Value>): Promise<BTree<Key, Value>> {
        if (this.root !== null) await this.root.traverse(visitor);
        return this;
    }

    async generatorTraverse() {
        return this.root === null ? null : this.root.generatorTraverse();
    }

    // function to search a key i n  this tre e
    async search(k: Key): Promise<BTreeNode<Key, Value>> {
        return this.root === null
            ? null
            : await this.root.search(k, this.comparator);
    }

    async searchRange(min: Key, max: Key): Promise<BTreeNode<Key, Value>> {
        return this.root === null
            ? null
            : await this.root.searchRange(min, max, this.comparator);
    }

    async searchGreather(min: Key): Promise<BTreeNode<Key, Value>> {
        return this.root === null
            ? null
            : await this.root.searchGreather(min, this.comparator);
    }

    async searchLess(max: Key): Promise<BTreeNode<Key, Value>> {
        return this.root === null
            ? null
            : await this.root.searchLess(max, this.comparator);
    }

    async save(value: Value): Promise<BTree<Key, Value>> {
        return await this.insert(this.keyGetter(value), value);
    }

    // The main function that inserts a new key   in th i s B-Tree
    async insert(k: Key, value: Value): Promise<BTree<Key, Value>> {
        const cid = await DAG.PutAsync(value);

        const t = this.t;
        //If tree is empty
        if (this.root === null) {
            // Allocate memory for root
            this.root = new BTreeNode<Key, Value>(t, true);
            this.root.keys[0] = k; // Insert key
            this.root.data[0] = cid;
            this.root.n = 1; // Update number of keys in root
        } else {
            // If tree is not empty
            const root = this.root;
            const comparator = this.comparator;
            // If root is full, then tree grows in height
            if (root.n === 2 * t - 1) {
                // Allocate memory for new root
                const s = new BTreeNode<Key, Value>(t, false);
                // Make old root as child of new root
                await s.setChild(root, 0);

                // Split the old root and move 1 key to the new root
                await s.splitChild(0, root, t);

                // New root has two children now.  Decide which of the
                // two children is going to have new key
                let i = 0;
                if (comparator(s.keys[0], k) < 0) i++;
                await s.setChild(
                    await (await s.getChild(i)).insertNonFull(
                        k,
                        cid,
                        comparator,
                        t
                    ),
                    i
                );

                // Change root
                this.root = s;
            } else {
                // If root is not full, call insertNonFull for root
                this.root = await root.insertNonFull(k, cid, comparator, t);
            }
        }
        this.size++;
        return this;
    }

    // The main function that rem o ves a   new key in  thie B-Tree
    async remove(k: Key): Promise<BTree<Key, Value>> {
        if (this.root === null) {
            throw new Error("The tree is empty");
        }

        // Call the remove function for root
        await this.root.remove(k, this.comparator, this.t);

        // If the root node has 0 keys, make its first child as the new root
        //  if it has a child, otherwise set root as NULL
        if (this.root.n === 0) {
            const tmp = this.root;
            if (this.root.leaf) this.root = null;
            else this.root = await this.root.getChild(0);
        }

        return this;
    }

    async height(): Promise<number> {
        if (this.root === null) return 0;
        return await this.root.height();
    }

    async keys(): Promise<Array<Key>> {
        const keys: Array<Key> = [];
        await this.traverse((key: Key) => keys.push(key));
        return keys;
    }

    async entries(): Promise<Array<Value>> {
        const values: Array<Value> = [];
        await this.traverse((key: Key, value: Value) => values.push(value));
        return values;
    }

    async getGreather(min: Key): Promise<Array<Value>> {
        const subtree = await this.searchGreather(min);
        const values: Array<Value> = [];
        await subtree.traverseGreather(
            min,
            (key: Key, value: Value) => values.push(value),
            this.comparator
        );
        return values;
    }

    async generatorGreather(min: Key) {
        const subtree = await this.searchGreather(min);
        return subtree.generatorGreather(min, this.comparator);
    }

    async getLess(max: Key): Promise<Array<Value>> {
        const subtree = await this.searchLess(max);
        const values: Array<Value> = [];
        await subtree.traverseLess(
            max,
            (key: Key, value: Value) => values.push(value),
            this.comparator
        );
        return values;
    }

    async generatorLess(max: Key) {
        const subtree = await this.searchLess(max);
        return subtree.generatorLess(max, this.comparator);
    }

    async getRange(min: Key, max: Key): Promise<Array<Value>> {
        const subtree = await this.searchRange(min, max);
        const values: Array<Value> = [];
        await subtree.traverseRange(
            min,
            max,
            (key: Key, value: Value) => values.push(value),
            this.comparator
        );
        return values;
    }

    async generatorRange(min: Key, max: Key) {
        const subtree = await this.searchRange(min, max);
        return subtree.generatorRange(min, max, this.comparator);
    }

    async get(key: Key): Promise<Value> {
        const leaf = await this.search(key);
        return leaf.data[leaf.findKey(key, this.comparator)];
    }

    toJSON() {
        return {
            root: this.root,
            t: this.t,
            comparator: this.comparator.toString(),
            keyGetter: this.keyGetter.toString(),
            size: this.size
        };
    }

    fromJSON(data: any): BTree<Key, Value> {
        this.root = new BTreeNode<Key, Value>().fromJSON(data.root);
        this.t = data.t;
        this.comparator = makeFunctionFromString(data.comparator);
        this.keyGetter = makeFunctionFromString(data.keyGetter);
        this.size = data.size;

        return this;
    }
}
