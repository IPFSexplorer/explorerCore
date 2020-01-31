export interface BTreeChildren<K, V> {
    splice(start: number, deleteCount?: number);
    splice(start: number, deleteCount: number, ...items);
    slice(start?: number, end?: number): BTreeChildren<K, V>;
    shift();
    push(...items: Child<K, V>[]);
    items: Child<K, V>[];
    length: number;
    get(i: number): Promise<Child<K, V>>;
    [Symbol.asyncIterator]();
}

export interface Node<K, V> {
    isLeaf?: boolean;
    parent?: Node<K, V>;
    children: BTreeChildren<K, V>;
    previousNode?: Node<K, V>;
    nextNode?: Node<K, V>;
}

export interface Child<K, V> {
    key: K;
    value?: V;
    node?: Node<K, V>;
}
