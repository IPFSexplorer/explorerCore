import { Comparator, Key, Value, Visitor, KeyGetter } from "./types";
import BTreeNode from "./btree_node";
import { makeFunctionFromString } from "../../common";
import { Serialize } from "serialazy";

export const DEFAULT_COMPARATOR: Comparator<Key> = (a: Key, b: Key) =>
    a < b ? -1 : +(a > b);
export const DEFAULT_KEY_GETTER: KeyGetter<Value, Key> = (a: Value) => a.id;

export default class BTree<Key, Value> {
    @Serialize({ nullable: true }) private root?: BTreeNode<Key, Value>;
    @Serialize() private t: number;
    @Serialize() public size: number;

    @Serialize.Custom({
        down: (comparator) => comparator.toString(),
        up: (comparatorString: string) => makeFunctionFromString(comparatorString)
    })
    public comparator: Comparator<Key>;

    @Serialize.Custom({
        down: (keyGetter) => keyGetter.toString(),
        up: (keyGetterString: string) => makeFunctionFromString(keyGetterString)
    })
    public keyGetter: KeyGetter<Value, Key>;

    constructor(
        t: number = 16,
        comparator: Comparator<Key> = DEFAULT_COMPARATOR,
        keyGetter: KeyGetter<Value, Key> = DEFAULT_KEY_GETTER
    )
    {
        this.root = null; // Pointer to root node
        this.t = t; // Minimum degree
        this.comparator = comparator;
        this.keyGetter = keyGetter;
        this.size = 0;
    }

    async traverse(visitor: Visitor<Key, Value>): Promise<BTree<Key, Value>>
    {
        if (this.root !== null) await this.root.traverse(visitor);
        return this;
    }

    async generatorTraverse()
    {
        return this.root === null ? null : this.root.generatorTraverse();
    }

    // function to search a key i n  this tre e
    async search(k: Key): Promise<BTreeNode<Key, Value>>
    {
        return this.root === null
            ? null
            : await this.root.search(k, this.comparator);
    }

    async searchRange(min: Key, max: Key): Promise<BTreeNode<Key, Value>>
    {
        return this.root === null
            ? null
            : await this.root.searchRange(min, max, this.comparator);
    }

    async searchGreather(min: Key): Promise<BTreeNode<Key, Value>>
    {
        return this.root === null
            ? null
            : await this.root.searchGreather(min, this.comparator);
    }

    async searchLess(max: Key): Promise<BTreeNode<Key, Value>>
    {
        return this.root === null
            ? null
            : await this.root.searchLess(max, this.comparator);
    }

    async save(value: Value): Promise<BTree<Key, Value>>
    {
        return await this.insert(this.keyGetter(value), value);
    }

    // The main function that inserts a new key   in th i s B-Tree
    async insert(k: Key, value: Value): Promise<BTree<Key, Value>>
    {

        const t = this.t;
        //If tree is empty
        if (this.root === null)
        {
            // Allocate memory for root
            this.root = new BTreeNode<Key, Value>(t, true);
            this.root.keys[0] = k; // Insert key
            this.root.data[0] = value;
            this.root.n = 1; // Update number of keys in root
        } else
        {
            // If tree is not empty
            const root = this.root;
            const comparator = this.comparator;
            // If root is full, then tree grows in height
            if (root.n === 2 * t - 1)
            {
                // Allocate memory for new root
                const s = new BTreeNode<Key, Value>(t, false);
                // Make old root as child of new root
                await s.children.setChild(root, 0);

                // Split the old root and move 1 key to the new root
                await s.splitChild(0, root, t);

                // New root has two children now.  Decide which of the
                // two children is going to have new key
                let i = 0;
                if (comparator(s.keys[0], k) < 0) i++;
                await s.children.setChild(
                    await (await s.children.getChild(i)).insertNonFull(
                        k,
                        value,
                        comparator,
                        t
                    ),
                    i
                );

                // Change root
                this.root = s;
            } else
            {
                // If root is not full, call insertNonFull for root
                this.root = await root.insertNonFull(k, value, comparator, t);
            }
        }
        this.size++;
        return this;
    }

    // The main function that rem o ves a   new key in  thie B-Tree
    // TODO: removing with non unique keys can remove different item
    async remove(v: Value): Promise<BTree<Key, Value>>
    {
        if (this.root === null)
        {
            return this;
        }

        const k = this.keyGetter(v);

        // Call the remove function for root
        await this.root.remove(k, this.comparator, this.t);

        // If the root node has 0 keys, make its first child as the new root
        //  if it has a child, otherwise set root as NULL
        if (this.root.n === 0)
        {
            if (this.root.leaf) this.root = null;
            else this.root = await this.root.children.getChild(0);
        }

        return this;
    }

    async height(): Promise<number>
    {
        if (this.root === null) return 0;
        return await this.root.height();
    }

    async keys(): Promise<Array<Key>>
    {
        const keys: Array<Key> = [];
        await this.traverse((key: Key) => keys.push(key));
        return keys;
    }

    async entries(): Promise<Array<Value>>
    {
        const values: Array<Value> = [];
        await this.traverse((key: Key, value: Value) => values.push(value));
        return values;
    }

    async getGreather(min: Key): Promise<Array<Value>>
    {
        const subtree = await this.searchGreather(min);
        const values: Array<Value> = [];
        await subtree.traverseGreather(
            min,
            (key: Key, value: Value) => values.push(value),
            this.comparator
        );
        return values;
    }

    async generatorGreather(min: Key)
    {
        const subtree = await this.searchGreather(min);
        return subtree === null
            ? []
            : subtree.generatorGreather(min, this.comparator);
    }

    async getLess(max: Key): Promise<Array<Value>>
    {
        const subtree = await this.searchLess(max);
        const values: Array<Value> = [];
        await subtree.traverseLess(
            max,
            (key: Key, value: Value) => values.push(value),
            this.comparator
        );
        return values;
    }

    async generatorLess(max: Key)
    {
        const subtree = await this.searchLess(max);
        return subtree === null
            ? []
            : subtree.generatorLess(max, this.comparator);
    }

    async getRange(min: Key, max: Key): Promise<Array<Value>>
    {
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

    async generatorRange(min: Key, max: Key)
    {
        const subtree = await this.searchRange(min, max);

        return subtree === null
            ? []
            : subtree.generatorRange(min, max, this.comparator);
    }

    async get(key: Key): Promise<Value>
    {
        const leaf = await this.search(key);
        return leaf === null
            ? null
            : leaf.data[leaf.findKey(key, this.comparator)];
    }

    toJSON()
    {
        return {
            root: this.root,
            t: this.t,
            comparator: this.comparator.toString(),
            keyGetter: this.keyGetter.toString(),
            size: this.size
        };
    }

    fromJSON(data: any): BTree<Key, Value>
    {
        this.root =
            data.root === null
                ? null
                : new BTreeNode<Key, Value>().fromJSON(data.root);
        this.t = data.t;
        this.comparator = makeFunctionFromString(data.comparator);
        this.keyGetter = makeFunctionFromString(data.keyGetter);
        this.size = data.size;

        return this;
    }
}
