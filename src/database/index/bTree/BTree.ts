import { BTreeChildren, Node, Child } from "./Interfaces";
import { container } from "tsyringe";
import IPFSBtreeNode from "./ipfs/IPFSBtreeNode";
export class BPlusTree<K, V> {
    root: Node<K, V>;
    branching: number;
    comparator: (a: K, b: K) => number;

    public constructor(
        branching: number = 32,
        comparator?: (a: K, b: K) => number
    ) {
        this.branching = branching;
        this.comparator = comparator;
        this.root = new IPFSBtreeNode<K, V>({
            isLeaf: true,
            children: container.resolve("BTreeChildren")
        });
    }

    public async find(key: K): Promise<V> {
        let leaf = await this._findLeaf(key, this.root);
        let { index, found } = await this.getChildIndex(key, leaf);

        if (found) {
            return (await leaf.children.get(index)).value;
        } else {
            return null;
        }
    }

    public async findLeaf(key: K): Promise<Node<K, V>> {
        return await this._findLeaf(key, this.root);
    }

    public async add(key: K, value: V) {
        let leaf = await this._findLeaf(key, this.root);
        let { index, found } = await this.getChildIndex(key, leaf);

        if (found) {
            // Add on an existing key updates the value
            (await leaf.children.get(index)).value = value;
            return;
        }

        await leaf.children.splice(index, 0, { key, value });

        if (leaf.children.length > this.branching - 1) {
            await this.split(leaf);
        }
    }

    private async split(node: Node<K, V>) {
        let midIndex = Math.floor(
            (node.children.length - (node.isLeaf ? 0 : 1)) / 2
        );
        let midKey = (await node.children.get(midIndex)).key;

        let newNode: Node<K, V> = new IPFSBtreeNode<K, V>({
            isLeaf: node.isLeaf,
            children: await node.children.slice(midIndex)
        });

        node.children = await node.children.slice(0, midIndex);

        if (!node.isLeaf) {
            let middleNode = newNode.children.shift().value;
            await node.children.push({ key: null, node: middleNode });

            for await (let child of newNode.children) {
                child.node.parent = newNode;
            }
        }

        let parent = node.parent;
        if (parent) {
            let { index } = await this.getChildIndex(midKey, parent);

            await parent.children.splice(index, 0, { key: midKey, node: node });
            (await parent.children.get(index + 1)).node = newNode;

            if (parent.children.length > this.branching) {
                await this.split(parent);
            }
        } else {
            const newChildrenClass: BTreeChildren<K, V> = container.resolve(
                "BTreeChildren"
            );
            await newChildrenClass.push(
                { key: midKey, node: node },
                { key: null, node: newNode }
            );

            this.root = new IPFSBtreeNode<K, V>({
                children: newChildrenClass
            });

            node.parent = newNode.parent = this.root;
            this.root.parent = null;
        }
    }

    public async _findLeaf(key: K, node: Node<K, V>): Promise<Node<K, V>> {
        if (node.isLeaf) {
            return node;
        } else {
            let { index, found } = await this.getChildIndex(key, node);

            let child = await node.children.get(index + (found ? 1 : 0));
            return await this._findLeaf(key, child.node);
        }
    }

    public async traverseRight(from: K) {
        let leaf = await this._findLeaf(from, this.root);
        let { index, found } = await this.getChildIndex(from, leaf);
        return {
            [Symbol.asyncIterator]: () => {
                return {
                    next: async () => {
                        const result = {
                            value: (await leaf.children.get(index)).value,
                            done: false
                        };

                        if (index + 1 >= leaf.children.length) {
                            if (!(await leaf.getNextNode())) {
                                result.done = true;
                                return result;
                            }
                            leaf = await leaf.getNextNode();
                            index = 0;
                        } else {
                            index++;
                        }
                        return result;
                    }
                };
            }
        };
    }

    public async traverseLeft(from: K) {
        let leaf = await this._findLeaf(from, this.root);
        let { index, found } = await this.getChildIndex(from, leaf);
        return {
            [Symbol.asyncIterator]: () => {
                return {
                    next: async () => {
                        const result = {
                            value: (await leaf.children.get(index)).value,
                            done: false
                        };

                        if (index <= 0) {
                            if (!(await leaf.getPreviousNode())) {
                                result.done = true;
                                return result;
                            }
                            leaf = await leaf.getPreviousNode();
                            index = leaf.children.length - 1;
                        } else {
                            index--;
                        }
                        return result;
                    }
                };
            }
        };
    }

    // Returns the index of the child key that is greater than or equal to the given key
    public async getChildIndex(
        key: K,
        node: Node<K, V>
    ): Promise<{ index: number; found: boolean }> {
        if (node.children.length == 0) {
            return { index: 0, found: false };
        }

        let end = node.children.length - 1;
        if (!node.isLeaf) {
            end--;
        }

        let index = await this.getChildIndexBinary(key, node.children, 0, end);
        let comparison = this.compareKey(
            key,
            (await node.children.get(index)).key
        );
        if (comparison == 0) {
            return { index: index, found: true };
        } else if (comparison < 0) {
            return { index: index, found: false };
        } else {
            return { index: index + 1, found: false };
        }
    }

    private async getChildIndexBinary(
        key: K,
        children: BTreeChildren<K, V>,
        start: number,
        end: number
    ): Promise<number> {
        if (start == end) {
            return start;
        }

        let mid = Math.floor((start + end) / 2);
        let comparison = this.compareKey(key, (await children.get(mid)).key);
        if (comparison == 0) {
            return mid;
        } else if (comparison < 0) {
            return this.getChildIndexBinary(
                key,
                children,
                start,
                Math.max(start, mid - 1)
            );
        } else {
            return this.getChildIndexBinary(
                key,
                children,
                Math.min(end, mid + 1),
                end
            );
        }
    }

    private compareKey(a: K, b: K): number {
        if (this.comparator) {
            return this.comparator(a, b);
        } else {
            if (typeof a === "number") {
                if (a < b) {
                    return -1;
                } else if (a > b) {
                    return 1;
                } else {
                    return 0;
                }
            } else if (typeof a === "string") {
                // The + ensures that the answer is always numeric rather than boolean.
                return a < b ? -1 : +(a > b);
            }
        }
    }

    public async print(): Promise<string> {
        return await this.printNode(
            { key: null, node: this.root },
            "",
            true,
            false,
            true
        );
    }

    private async printNode(
        nodeItem: Child<K, V>,
        prefix: string,
        isLast: boolean,
        isLeaf: boolean,
        isRoot: boolean
    ): Promise<string> {
        let result: string = "";

        if (!isRoot) {
            let valueString = isLeaf ? ` [${nodeItem.value}]` : "";
            result =
                prefix +
                (isLast ? "└── " : "├── ") +
                nodeItem.key +
                valueString;
        }
        if (!isLeaf) {
            let node = nodeItem.node;
            for (let i = 0; i < node.children.length; i++) {
                let isLastChild = i == node.children.length - 1;
                result +=
                    "\n" +
                    (await this.printNode(
                        await node.children.get(i),
                        prefix + (isLast ? "    " : "│   "),
                        isLastChild,
                        node.isLeaf,
                        false
                    ));
            }
        }
        return result;
    }
}
