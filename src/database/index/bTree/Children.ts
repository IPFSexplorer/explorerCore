import { Child } from "./Interfaces";

export interface Children<K, V> {
    splice(start: number, deleteCount?: number);
    splice(start: number, deleteCount: number, ...items);
    slice(start?: number, end?: number): Children<K, V>;
    shift();
    push(...items: Child<K, V>[]);
    items: Child<K, V>[];
    length: number;
    get(i: number): Child<K, V>;
    [Symbol.iterator](): Iterator<Child<K, V>>;
}
