import { BTreeChildren, Node, Child } from "./Interfaces";
import Index from "..";
import { container } from "tsyringe";

export class BPlusTree<K, V> extends Index {
    root: Node<K, V>;
    branching: number;
    comparator: (a: K, b: K) => number;

    public constructor(
        branching: number = 32,
        comparator?: (a: K, b: K) => number
    ) {
        super();
        this.branching = branching;
        this.comparator = comparator;
        this.root = {
            isLeaf: true,
            children: container.resolve("BTreeChildren")
        };
    }

    public find(key: K): V {
        let leaf = this._findLeaf(key, this.root);
        let { index, found } = this.getChildIndex(key, leaf);

        if (found) {
            return leaf.children.get(index).value;
        } else {
            return null;
        }
    }

    public findLeaf(key: K): Node<K, V> {
        return this._findLeaf(key, this.root);
    }

    public add(key: K, value: V) {
        let leaf = this._findLeaf(key, this.root);
        let { index, found } = this.getChildIndex(key, leaf);

        if (found) {
            // Add on an existing key updates the value
            leaf.children.get(index).value = value;
            return;
        }

        leaf.children.splice(index, 0, { key, value });

        if (leaf.children.length > this.branching - 1) {
            this.split(leaf);
        }
    }

    private split(node: Node<K, V>) {
        let midIndex = Math.floor(
            (node.children.length - (node.isLeaf ? 0 : 1)) / 2
        );
        let midKey = node.children.get(midIndex).key;

        let newNode: Node<K, V> = {
            isLeaf: node.isLeaf,
            parent: node.parent,
            children: node.children.slice(midIndex)
        };

        if (newNode.isLeaf) {
            newNode.nextNode = node.nextNode;
            newNode.previousNode = node;

            if (newNode.nextNode) newNode.nextNode.previousNode = newNode;
            node.nextNode = newNode;
        }

        node.children = node.children.slice(0, midIndex);

        if (!node.isLeaf) {
            let middleNode = newNode.children.shift().node;
            node.children.push({ key: null, node: middleNode });

            for (let child of newNode.children) {
                child.node.parent = newNode;
            }
        }

        let parent = node.parent;
        if (parent) {
            let { index } = this.getChildIndex(midKey, parent);

            parent.children.splice(index, 0, { key: midKey, node: node });
            parent.children.get(index + 1).node = newNode;

            if (parent.children.length > this.branching) {
                this.split(parent);
            }
        } else {
            const newChildrenClass: BTreeChildren<K, V> = container.resolve(
                "BTreeChildren"
            );
            newChildrenClass.push(
                { key: midKey, node: node },
                { key: null, node: newNode }
            );

            this.root = {
                children: newChildrenClass
            };

            node.parent = newNode.parent = this.root;
        }
    }

    public _findLeaf(key: K, node: Node<K, V>): Node<K, V> {
        if (node.isLeaf) {
            return node;
        } else {
            let { index, found } = this.getChildIndex(key, node);

            let child = node.children.get(index + (found ? 1 : 0));
            return this._findLeaf(key, child.node);
        }
    }

    // Returns the index of the child key that is greater than or equal to the given key
    private getChildIndex(
        key: K,
        node: Node<K, V>
    ): { index: number; found: boolean } {
        if (node.children.length == 0) {
            return { index: 0, found: false };
        }

        let end = node.children.length - 1;
        if (!node.isLeaf) {
            end--;
        }

        let index = this.getChildIndexBinary(key, node.children, 0, end);
        let comparison = this.compareKey(key, node.children.get(index).key);
        if (comparison == 0) {
            return { index: index, found: true };
        } else if (comparison < 0) {
            return { index: index, found: false };
        } else {
            return { index: index + 1, found: false };
        }
    }

    private getChildIndexBinary(
        key: K,
        children: BTreeChildren<K, V>,
        start: number,
        end: number
    ): number {
        if (start == end) {
            return start;
        }

        let mid = Math.floor((start + end) / 2);
        let comparison = this.compareKey(key, children.get(mid).key);
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
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    public print(): string {
        return this.printNode(
            { key: null, node: this.root },
            "",
            true,
            false,
            true
        );
    }

    private printNode(
        nodeItem: Child<K, V>,
        prefix: string,
        isLast: boolean,
        isLeaf: boolean,
        isRoot: boolean
    ): string {
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
                    this.printNode(
                        node.children.get(i),
                        prefix + (isLast ? "    " : "│   "),
                        isLastChild,
                        node.isLeaf,
                        false
                    );
            }
        }
        return result;
    }
}
