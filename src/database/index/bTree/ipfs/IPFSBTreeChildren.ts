import { BTreeChildren, Child } from "../Interfaces";
import CID from "cids";
import DAG from "@/ipfs/DAG";

export interface InnerChild<K> {
    key: K;
    value?: string;
    node?: string;
}

export default class IPFSBTreeChildren<K, V> implements BTreeChildren<K, V> {
    constructor() {}

    items: InnerChild<K>[] = [];

    async splice(start: number, deleteCount: number, ...items: Child<K, V>[]) {
        var results = await Promise.all(
            items.map(async item => {
                return {
                    key: item.key,
                    value: await DAG.PutAsync(item.value)
                };
            })
        );
        return this.items.splice(start, deleteCount, ...results);
    }

    async slice(start?: number, end?: number): Promise<BTreeChildren<K, V>> {
        const newChildren = new IPFSBTreeChildren<K, V>();
        for (const item of this.items.slice(start, end)) {
            await newChildren.push({
                key: item.key,
                value: await DAG.GetAsync(item.value)
            });
        }

        return newChildren;
    }

    shift() {
        return this.items.shift();
    }

    async push(...items: Child<K, V>[]) {
        for (const item of items) {
            this.items.push(await DAG.PutAsync(item));
        }
        return this.items;
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
        return {
            key: this.items[i].key,
            value: await DAG.GetAsync(this.items[i].value)
        };
    }
}
