import IndexStore from "../indexes/indexStore";

import { Index } from ".";
import { Comparator, KeyGetter } from "../../BTree/types";
import { DEFAULT_COMPARATOR } from "../../BTree/btree";

export function PrimaryKey(
    comparator: Comparator<any> = DEFAULT_COMPARATOR,
    keyGetter: KeyGetter<any, any> = null,
    branching: number = 16
) {
    return Index(comparator, keyGetter, branching, true);
}
