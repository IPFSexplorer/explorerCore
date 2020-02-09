import IndexStore from "../indexes/indexStore";
import BTree, { DEFAULT_COMPARATOR } from "@/database/BTree/BTree";
import { Comparator, KeyGetter } from "@/database/BTree/types";

export function Index(
    comparator: Comparator<any> = DEFAULT_COMPARATOR,
    keyGetter: KeyGetter<any, any> = null,
    branching: number = 16
) {
    return (target, property) => {
        if (keyGetter === null) {
            keyGetter = v => v[property];
        }

        IndexStore.addIndex(
            target.constructor.name,
            property,
            new BTree(branching, comparator, keyGetter),
            false
        );
    };
}
