import { Children, Child } from "./BTree";

export default class LocalBTreeChildren<K, V> implements Children<K, V> {
    items: Child<K, V>[];

    get length(): number {
        return this.items.length;
    }

    get(i: number): Child<K, V> {
        return this.items[i]
    }
    [Symbol.iterator](): V {
        throw new Error("Method not implemented.");
    }

    function splice(start: number, deleteCount?: number): T[];

function splice(start: number, deleteCount: number, ...items: T[]): T[];
}