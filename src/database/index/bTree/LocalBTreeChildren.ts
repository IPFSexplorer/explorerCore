import { BTreeChildren, Child } from "./Interfaces";
import store from "@/store";

export default class LocalBTreeChildren<K, V> implements BTreeChildren<K, V> {
    constructor() { }

    items: Child<K, V>[] = [];

    splice(start: number, deleteCount: number, ...items: Child<K, V>[]) {
        return this.items.splice(start, deleteCount, ...items);
    }

    slice(start?: number, end?: number): BTreeChildren<K, V> {
        const newChildren = new LocalBTreeChildren<K, V>();
        for (const item of this.items.slice(start, end)) {
            newChildren.push(item);
        }

        return newChildren;
    }

    shift() {
        return this.items.shift();
    }

    push(...items: Child<K, V>[]) {
        return this.items.push(...items);
    }

    [Symbol.asyncIterator](): AsyncIterator<Child<K, V>> {
        let i = 0;
        return {
            next: async () => ({
                value: await this.get(i),
                done: i++ === this.items.length
            })
        };
    }

    get length(): number {
        return this.items.length;
    }

    async get(i: number): Promise<Child<K, V>> {
        await store.dispatch("addNode", this.items[i]);
        return this.items[i];
    }
}
