import { Key, Value, Comparator, Visitor } from "./types";
import IBtreeNodeChildren from "./children/Ichildren";
import { Serialize, deflate, inflate } from "serialazy";
import localBtreeNodeChildren from "./children/localChildren";
import { container } from "tsyringe";
import ipfsBtreeNodeChildren from "./children/ipfsChildren";

export default class BTreeNode<Key, Value> {
    @Serialize() leaf: boolean;

    @Serialize.Custom({
        down: (data: Array<Value>) => data,
        up: (data: Array<any>) => data,
    })
    data: Array<Value>;

    @Serialize.Custom({
        down: (keys: Array<Value>) => keys,
        up: (keys: Array<any>) => keys,
    })
    keys: Array<Key>;

    @Serialize() n: number;

    @Serialize.Custom({
        down: (children: IBtreeNodeChildren) => deflate(children),
        up: (children: Array<any>) => inflate(ipfsBtreeNodeChildren, children),
    })
    children: IBtreeNodeChildren;

    constructor(t: number = 0, isLeaf: boolean = false)
    {
        // Copy the given minimum degree and leaf property
        this.leaf = isLeaf; // Is true when node is leaf. Otherwise false

        // Allocate memory for maximum number of possible keys
        // and child pointers
        if (t > 0)
        {
            this.keys = new Array(2 * t - 1); // An array of keys
            this.data = new Array(2 * t - 1);
            this.children = new ipfsBtreeNodeChildren();
        }
        this.n = 0; // Current number of keys
    }

    // Function to traverse all nodes in a subtree rooted with this node
    async *generatorTraverse()
    {
        // There are n keys and n+1 children, travers through n keys
        // and first n children
        const keys = this.keys;
        const data = this.data;
        let i: number;
        for (i = 0; i < this.n; i++)
        {
            // If this is not leaf, then before printing key[i],
            // traverse the subtree rooted with child C[i].
            if (!this.leaf)
                yield* await (await this.children.getChild(i)).generatorTraverse();
            yield data[i];
        }

        // Print the subtree rooted with last child
        if (!this.leaf)
            yield* await (await this.children.getChild(i)).generatorTraverse();
    }

    // Function to traverse all nodes in a subtree rooted with this node
    async traverse(visitor: Visitor<Key, Value>): Promise<void>
    {
        // There are n keys and n+1 children, travers through n keys
        // and first n children
        const keys = this.keys;
        const data = this.data;
        let i: number;
        for (i = 0; i < this.n; i++)
        {
            // If this is not leaf, then before printing key[i],
            // traverse the subtree rooted with child C[i].
            if (!this.leaf) await (await this.children.getChild(i)).traverse(visitor);
            visitor(keys[i], data[i]);
        }

        // Print the subtree rooted with last child
        if (!this.leaf) await (await this.children.getChild(i)).traverse(visitor);
    }

    async *generatorLess(max: Key, comparator: Comparator<Key>)
    {
        // There are n keys and n+1 children, travers through n keys
        // and first n children
        const keys = this.keys;
        const data = this.data;

        let i: number;
        for (i = 0; i < this.n && comparator(max, keys[i]) > 0; i++)
        {
            // If this is not leaf, then before printing key[i],
            // traverse the subtree rooted with child C[i].
            if (!this.leaf)
                yield* await (await this.children.getChild(i)).generatorLess(
                    max,
                    comparator
                );
            yield data[i];
        }

        // Print the subtree rooted with last child
        if (!this.leaf)
            yield* await (await this.children.getChild(i)).generatorLess(
                max,
                comparator
            );
    }

    async traverseLess(
        max: Key,
        visitor: Visitor<Key, Value>,
        comparator: Comparator<Key>
    ): Promise<void>
    {
        // There are n keys and n+1 children, travers through n keys
        // and first n children
        const keys = this.keys;
        const data = this.data;

        let i: number;
        for (i = 0; i < this.n && comparator(max, keys[i]) > 0; i++)
        {
            // If this is not leaf, then before printing key[i],
            // traverse the subtree rooted with child C[i].
            if (!this.leaf)
                await (await this.children.getChild(i)).traverseLess(
                    max,
                    visitor,
                    comparator
                );
            visitor(keys[i], data[i]);
        }

        // Print the subtree rooted with last child
        if (!this.leaf)
            await (await this.children.getChild(i)).traverseLess(
                max,
                visitor,
                comparator
            );
    }

    async *generatorGreather(min: Key, comparator: Comparator<Key>)
    {
        // There are n keys and n+1 children, travers through n keys
        // and first n children
        const keys = this.keys;
        const data = this.data;

        let i = 0;
        while (i < this.n && comparator(min, keys[i]) >= 0) i++;

        for (; i < this.n; i++)
        {
            // If this is not leaf, then before printing key[i],
            // traverse the subtree rooted with child C[i].
            if (!this.leaf)
                yield* await (await this.children.getChild(i)).generatorGreather(
                    min,
                    comparator
                );
            yield data[i];
        }

        // Print the subtree rooted with last child
        if (!this.leaf)
            yield* await (await this.children.getChild(i)).generatorGreather(
                min,
                comparator
            );
    }

    async traverseGreather(
        min: Key,
        visitor: Visitor<Key, Value>,
        comparator: Comparator<Key>
    ): Promise<void>
    {
        // There are n keys and n+1 children, travers through n keys
        // and first n children
        const keys = this.keys;
        const data = this.data;

        let i = 0;
        while (i < this.n && comparator(min, keys[i]) >= 0) i++;

        for (; i < this.n; i++)
        {
            // If this is not leaf, then before printing key[i],
            // traverse the subtree rooted with child C[i].
            if (!this.leaf)
                await (await this.children.getChild(i)).traverseGreather(
                    min,
                    visitor,
                    comparator
                );
            visitor(keys[i], data[i]);
        }

        // Print the subtree rooted with last child
        if (!this.leaf)
            await (await this.children.getChild(i)).traverseGreather(
                min,
                visitor,
                comparator
            );
    }

    async *generatorRange(min: Key, max: Key, comparator: Comparator<Key>)
    {
        // There are n keys and n+1 children, travers through n keys
        // and first n children
        const keys = this.keys;
        const data = this.data;

        let i = 0;
        while (i < this.n && comparator(min, keys[i]) > 0) i++;

        for (; i < this.n && comparator(max, keys[i]) >= 0; i++)
        {
            // If this is not leaf, then before printing key[i],
            // traverse the subtree rooted with child C[i].
            if (!this.leaf)
                yield* await (await this.children.getChild(i)).generatorRange(
                    min,
                    max,
                    comparator
                );
            yield data[i];
        }

        // Print the subtree rooted with last child
        if (!this.leaf)
            yield* await (await this.children.getChild(i)).generatorRange(
                min,
                max,
                comparator
            );
    }

    async traverseRange(
        min: Key,
        max: Key,
        visitor: Visitor<Key, Value>,
        comparator: Comparator<Key>
    ): Promise<void>
    {
        // There are n keys and n+1 children, travers through n keys
        // and first n children
        const keys = this.keys;
        const data = this.data;

        let i = 0;
        while (i < this.n && comparator(min, keys[i]) > 0) i++;

        for (; i < this.n && comparator(max, keys[i]) >= 0; i++)
        {
            // If this is not leaf, then before printing key[i],
            // traverse the subtree rooted with child C[i].
            if (!this.leaf)
                await (await this.children.getChild(i)).traverseRange(
                    min,
                    max,
                    visitor,
                    comparator
                );
            visitor(keys[i], data[i]);
        }

        // Print the subtree rooted with last child
        if (!this.leaf)
            await (await this.children.getChild(i)).traverseRange(
                min,
                max,
                visitor,
                comparator
            );
    }

    async searchGreather(
        min: Key,
        comparator: Comparator<Key>
    ): Promise<BTreeNode<Key, Value>>
    {
        if (this.leaf) return this;

        // Find the first key greater than or equal to k
        let i = this.n - 1;
        const keys = this.keys;

        while (i > 0 && comparator(min, keys[i]) < 0) i--;
        i++;

        // Go to the appropriate child
        if (i == this.n)
        {
            return await (await this.children.getChild(i)).searchGreather(
                min,
                comparator
            );
        } else
        {
            // this node is subtree of range
            return this;
        }
    }

    async searchLess(
        max: Key,
        comparator: Comparator<Key>
    ): Promise<BTreeNode<Key, Value>>
    {
        if (this.leaf) return this;

        // Find the first key greater than or equal to k
        let i = 0;
        const keys = this.keys;
        while (i < this.n && comparator(max, keys[i]) > 0) i++;

        // Go to the appropriate child
        if (i == 0)
        {
            return await (await this.children.getChild(i)).searchLess(max, comparator);
        } else
        {
            // this node is subtree of range
            return this;
        }
    }

    // Function to search key k in subtree rooted with this node
    async searchRange(
        min: Key,
        max: Key,
        comparator: Comparator<Key>
    ): Promise<BTreeNode<Key, Value>>
    {
        if (this.leaf) return this;

        // Find the first key greater than or equal to k
        let i = 0;
        let j = this.n - 1;
        const keys = this.keys;
        while (i < this.n && comparator(min, keys[i]) > 0) i++;
        while (j > 0 && comparator(max, keys[j]) < 0) j--;

        // Go to the appropriate child
        if (i == j + 1)
        {
            return await (await this.children.getChild(i)).searchRange(
                min,
                max,
                comparator
            );
        } else
        {
            // this node is subtree of range
            return this;
        }
    }

    // Function to search key k in subtree rooted with this node
    async search(
        key: Key,
        comparator: Comparator<Key>
    ): Promise<BTreeNode<Key, Value>>
    {
        // Find the first key greater than or equal to k
        let i = 0;
        const keys = this.keys;
        while (i < this.n && comparator(key, keys[i]) > 0) i++;

        // If the found key is equal to k, return this node
        if (i < this.n && comparator(keys[i], key) === 0) return this;

        // If key is not found here and this is a leaf node
        if (this.leaf) return null;

        // Go to the appropriate child
        return await (await this.children.getChild(i)).search(key, comparator);
    }

    // A utility function that returns the index of the first key that is
    // greater than or equal to k
    findKey(key: Key, comparator: Comparator<Key>): number
    {
        let idx = 0;
        while (idx < this.n && comparator(this.keys[idx], key) < 0) idx++;
        return idx;
    }

    // A utility function to insert a new key in this node
    // The assumption is, the node must be non-full when this
    // function is called
    async insertNonFull(
        k: Key,
        value: Value,
        comparator: Comparator<Key>,
        t: number
    ): Promise<BTreeNode<Key, Value>>
    {
        // Initialize index as index of rightmost element
        let i = this.n - 1;
        const keys = this.keys;
        const data = this.data;

        // If this is a leaf node
        if (this.leaf)
        {
            // The following loop does two things
            // a) Finds the location of new key to be inserted
            // b) Moves all greater keys to one place ahead
            while (i >= 0 && comparator(keys[i], k) > 0)
            {
                keys[i + 1] = keys[i];
                data[i + 1] = data[i];
                i--;
            }

            // Insert the new key at found location
            keys[i + 1] = k;
            data[i + 1] = value;
            this.n++;
        } else
        {
            // If this node is not leaf
            // Find the child which is going to have the new key
            while (i >= 0 && comparator(keys[i], k) > 0) i--;

            // See if the found child is full
            if ((await this.children.getChild(i + 1)).n === 2 * t - 1)
            {
                // If the child is full, then split it
                await this.splitChild(i + 1, await this.children.getChild(i + 1), t);
                // After split, the middle key of C[i] goes up and
                // C[i] is splitted into two.  See which of the two
                // is going to have the new key
                if (comparator(keys[i + 1], k) < 0) i++;
            }
            await this.children.setChild(
                await (await this.children.getChild(i + 1)).insertNonFull(
                    k,
                    value,
                    comparator,
                    t
                ),
                i + 1
            );
        }
        return this;
    }

    // A utility function to split the child y of this node
    // Note that y must be full when this function is called
    async splitChild(i: number, y: BTreeNode<Key, Value>, t: number)
    {
        const n = this.n;
        const data = this.data;
        const keys = this.keys;

        // Create a new node which is going to store (t-1) keys of y
        const z = new BTreeNode<Key, Value>(t, y.leaf);
        z.n = t - 1;

        // Copy the last (t-1) keys of y to z
        for (let j = 0; j < t - 1; j++)
        {
            z.keys[j] = y.keys[j + t];
            z.data[j] = y.data[j + t];
        }

        // Copy the last t children of y to z
        if (!y.leaf)
        {
            for (let j = 0; j < t; j++)
            {
                await z.children.setChild(await y.children.getChild(j + t), j);
                await y.children.setChild(undefined, j + t);
            }
        }

        // Reduce the number of keys in y
        y.n = t - 1;
        y.data.fill(undefined, t);
        y.keys.fill(undefined, t);
        await this.children.setChild(y, i);

        // Since this node is going to have a new child,
        // create space of new child
        for (let j = n; j >= i + 1; j--)
            await this.children.setChild(await this.children.getChild(j), j + 1);

        // Link the new child to this node
        await this.children.setChild(z, i + 1);

        // A key of y will move to this node. Find location of
        // new key and move all greater keys one space ahead
        for (let j = n - 1; j >= i; j--)
        {
            keys[j + 1] = keys[j];
            data[j + 1] = data[j];
        }

        // Copy the middle key of y to this node
        keys[i] = y.keys[t - 1];
        data[i] = y.data[t - 1];

        // Increment count of keys in this node
        this.n = n + 1;
    }

    // A function to remove the key k from the sub-tree rooted with this node
    async remove(k: Key, comparator: Comparator<Key>, t: number)
    {
        let idx = this.findKey(k, comparator);
        const n = this.n;
        const keys = this.keys;

        // The key to be removed is present in this node
        if (idx < n && comparator(keys[idx], k) === 0)
        {
            // If the node is a leaf node - removeFromLeaf is called
            // Otherwise, removeFromNonLeaf function is called
            if (this.leaf) this.removeFromLeaf(idx);
            else await this.removeFromNonLeaf(idx, comparator, t);
        } else
        {
            // If this node is a leaf node, then the key is not present in tree
            if (this.leaf)
                return this;

            // The key to be removed is present in the sub-tree rooted with this node
            // The flag indicates whether the key is present in the sub-tree rooted
            // with the last child of this node
            const flag = idx === n;

            // If the child where the key is supposed to exist has less that t keys,
            // we fill that child
            if ((await this.children.getChild(idx)).n < t) await this.fill(idx, t);

            // If the last child has been merged, it must have merged with the previous
            // child and so we recurse on the (idx-1)th child. Else, we recurse on the
            // (idx)th child which now has atleast t keys
            if (flag && idx > n)
                await (await this.children.getChild(idx - 1)).remove(k, comparator, t);
            else await (await this.children.getChild(idx)).remove(k, comparator, t);
        }
    }

    // A function to remove the idx-th key from this node - which is a leaf node
    removeFromLeaf(idx: number)
    {
        // Move all the keys after the idx-th pos one place backward
        const keys = this.keys;
        const data = this.data;
        for (let i = idx + 1; i < this.n; i++)
        {
            keys[i - 1] = keys[i];
            data[i - 1] = data[i];
        }
        // Reduce the count of keys
        this.n--;
    }

    // A function to remove the idx-th key from this node - which is a non-leaf node
    async removeFromNonLeaf(
        idx: number,
        comparator: Comparator<Key>,
        t: number
    )
    {
        const keys = this.keys;
        const data = this.data;

        let k: Key = keys[idx];

        // If the child that precedes k (C[idx]) has atleast t keys,
        // find the predecessor 'pred' of k in the subtree rooted at
        // C[idx]. Replace k by pred. Recursively delete pred
        // in C[idx]
        if ((await this.children.getChild(idx)).n >= t)
        {
            let cur = await this.children.getChild(idx);
            while (!cur.leaf) cur = await cur.children.getChild(cur.n);
            const predKey = cur.keys[cur.n - 1];
            keys[idx] = predKey;
            data[idx] = cur.data[cur.n - 1];
            await (await this.children.getChild(idx)).remove(predKey, comparator, t);
        } else if ((await this.children.getChild(idx + 1)).n >= t)
        {
            // If the child C[idx] has less that t keys, examine C[idx+1].
            // If C[idx+1] has atleast t keys, find the successor 'succ' of k in
            // the subtree rooted at C[idx+1]
            // Replace k by succ
            // Recursively delete succ in C[idx+1]
            let cur = await this.children.getChild(idx + 1);
            while (!cur.leaf) cur = await cur.children.getChild(0);
            // Return the first key of the leaf
            const succKey = cur.keys[0];
            const succData = cur.data[0];
            keys[idx] = succKey;
            data[idx] = cur.data[0];
            await (await this.children.getChild(idx + 1)).remove(succKey, comparator, t);
        } else
        {
            // If both C[idx] and C[idx+1] has less that t keys,merge k and all of C[idx+1]
            // into C[idx]
            // Now C[idx] contains 2t-1 keys
            // Free C[idx+1] and recursively delete k from C[idx]
            await this.merge(idx, t);
            await (await this.children.getChild(idx)).remove(k, comparator, t);
        }
    }

    // A function to get predecessor of keys[idx]
    async prev(idx: number): Promise<Key>
    {
        // Keep moving to the right most node until we reach a leaf
        // eslint-disable-next-line prettier/prettier
        let cur = (await this.children.getChild(idx));
        while (!cur.leaf) cur = await cur.children.getChild(cur.n);
        // Return the last key of the leaf
        return cur.keys[cur.n - 1];
    }

    async next(idx: number): Promise<Key>
    {
        // Keep moving the left most node starting from C[idx+1] until we reach a leaf
        let cur = await this.children.getChild(idx + 1);
        while (!cur.leaf) cur = await cur.children.getChild(0);
        // Return the first key of the leaf
        return cur.keys[0];
    }

    // A function to fill child C[idx] which has less than t-1 keys
    async fill(idx: number, t: number): Promise<void>
    {
        const n = this.n;
        // If the previous child(C[idx-1]) has more than t-1 keys, borrow a key
        // from that child
        if (idx !== 0 && (await this.children.getChild(idx - 1)).n >= t)
            await this.borrowFromPrev(idx);
        // If the next child(C[idx+1]) has more than t-1 keys, borrow a key
        // from that child
        else if (idx !== n && (await this.children.getChild(idx + 1)).n >= t)
            await this.borrowFromNext(idx);
        // Merge C[idx] with its sibling
        // If C[idx] is the last child, merge it with with its previous sibling
        // Otherwise merge it with its next sibling
        else
        {
            if (idx !== n) await this.merge(idx, t);
            else await this.merge(idx - 1, t);
        }
    }

    // A function to borrow a key from C[idx-1] and insert it
    // into C[idx]
    async borrowFromPrev(idx: number): Promise<void>
    {
        const keys = this.keys;
        const data = this.data;
        const child = await this.children.getChild(idx);
        const sibling = await this.children.getChild(idx - 1);

        // The last key from C[idx-1] goes up to the parent and key[idx-1]
        // from parent is inserted as the first key in C[idx]. Thus, the  loses
        // sibling one key and child gains one key

        // Moving all key in C[idx] one step ahead
        for (let i = child.n - 1; i >= 0; i--)
        {
            child.keys[i + 1] = child.keys[i];
            child.data[i + 1] = child.data[i];
        }

        // If C[idx] is not a leaf, move all its child pointers one step ahead
        if (!child.leaf)
        {
            for (let i = child.n; i >= 0; i--)
                await child.children.setChild(await child.children.getChild(i), i + 1);
        }

        // Setting child's first key equal to keys[idx-1] from the current node
        child.keys[0] = keys[idx - 1];
        child.data[0] = data[idx - 1];

        // Moving sibling's last child as C[idx]'s first child
        if (!this.leaf)
            await child.children.setChild(await sibling.children.getChild(sibling.n), 0);

        // Moving the key from the sibling to the parent
        // This reduces the number of keys in the sibling
        keys[idx - 1] = sibling.keys[sibling.n - 1];
        data[idx - 1] = sibling.data[sibling.n - 1];

        child.n++;
        sibling.n--;
    }

    // A function to borrow a key from the C[idx+1] and place
    // it in C[idx]
    async borrowFromNext(idx: number): Promise<void>
    {
        const keys = this.keys;
        const data = this.data;

        const child: BTreeNode<Key, Value> = await this.children.getChild(idx);
        const sibling: BTreeNode<Key, Value> = await this.children.getChild(idx + 1);

        // keys[idx] is inserted as the last key in C[idx]
        child.keys[child.n] = keys[idx];
        child.data[child.n] = data[idx];

        // Sibling's first child is inserted as the last child
        // into C[idx]
        if (!child.leaf)
            await child.children.setChild(await sibling.children.getChild(0), child.n + 1);

        //The first key from sibling is inserted into keys[idx]
        keys[idx] = sibling.keys[0];
        data[idx] = sibling.data[0];

        // Moving all keys in sibling one step behind
        for (let i = 1; i < sibling.n; i++)
        {
            sibling.keys[i - 1] = sibling.keys[i];
            sibling.data[i - 1] = sibling.data[i];
        }

        // Moving the child pointers one step behind
        if (!sibling.leaf)
        {
            for (let i = 1; i <= sibling.n; i++)
                await sibling.children.setChild(await sibling.children.getChild(i), i - 1);
        }

        // Increasing and decreasing the key count of C[idx] and C[idx+1]
        // respectively
        child.n++;
        sibling.n--;
    }

    // A function to merge C[idx] with C[idx+1]
    // C[idx+1] is freed after merging
    async merge(idx: number, t: number): Promise<void>
    {
        const n = this.n;
        const keys = this.keys;
        const data = this.data;
        const child = await this.children.getChild(idx);
        const sibling = await this.children.getChild(idx + 1);

        // Pulling a key from the current node and inserting it into (t-1)th
        // position of C[idx]
        child.keys[t - 1] = keys[idx];

        // Copying the keys from C[idx+1] to C[idx] at the end
        for (let i = 0; i < sibling.n; i++)
        {
            child.keys[i + t] = sibling.keys[i];
            child.data[i + t] = sibling.data[i];
        }

        // Copying the child pointers from C[idx+1] to C[idx]
        if (!child.leaf)
        {
            for (let i = 0; i <= sibling.n; i++)
                await child.children.setChild(await sibling.children.getChild(i), i + t);
        }

        // Moving all keys after idx in the current node one step before -
        // to fill the gap created by moving keys[idx] to C[idx]
        for (let i = idx + 1; i < n; i++)
        {
            keys[i - 1] = keys[i];
            data[i - 1] = data[i];
        }

        // Moving the child pointers after (idx+1) in the current node one step before
        for (let i = idx + 2; i <= n; i++)
            await this.children.setChild(await this.children.getChild(i), i - 1);

        // Updating the key count of child and the current node
        child.n += sibling.n + 1;
        this.n--;
        return;
    }

    async height(): Promise<number>
    {
        if (this.leaf) return 1;
        else
        {
            let h = 0;
            for (let i = 0; i < this.n; i++)
            {
                h = Math.max(h, await (await this.children.getChild(i)).height());
            }
            return h + 1;
        }
    }

    fromJSON(data: any): BTreeNode<Key, Value>
    {
        this.leaf = data.leaf;
        this.keys = data.keys;
        this.data = data.data;
        this.n = data.n;
        this.children = data.children;

        return this;
    }
}
