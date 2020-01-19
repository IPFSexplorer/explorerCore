import { Child } from "./BTree";
import { Children } from "./Children";

export default class LocalBTreeChildren<K, V> implements Children<K, V> {
    constructor(items: Child<K, V>[] = []) {
        this.items = items;
    }

    items: Child<K, V>[];

    splice(start: number, deleteCount: number, ...items: Child<K, V>[]) {
        return this.items.splice(start, deleteCount, ...items);
    }

    slice(start?: number, end?: number): Children<K, V> {
        return new LocalBTreeChildren(this.items.slice(start, end));
    }

    shift() {
        return this.items.shift();
    }

    push(...items: Child<K, V>[]) {
        return this.items.push(...items);
    }

    [Symbol.iterator](): Iterator<Child<K, V>> {
        let i = 0;
        return {
            next: () => ({
                value: this.items[i++],
                done: i == this.items.length
            })
        };
    }

    get length(): number {
        return this.items.length;
    }

    get(i: number): Child<K, V> {
        return this.items[i];
    }
}
