import CID from "cids";

export interface BTreeChildren<K, V> {
    splice(start: number, deleteCount?: number);
    splice(start: number, deleteCount: number, ...items);
    slice(start?: number, end?: number);
    shift();
    push(...items: Child<K, V>[]);
    items: any[];
    length: number;
    get(i: number): Promise<Child<K, V>>;
    [Symbol.asyncIterator]();
}

export interface Node<K, V> {
    isLeaf?: boolean;
    children: BTreeChildren<K, V>;
}

export interface Child<K, V> {
    key: K;
    value?: V;
    node?: Node<K, V>;
}
