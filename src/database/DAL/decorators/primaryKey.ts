import IndexStore from "../indexes/indexStore";
import BTree, { DEFAULT_COMPARATOR, DEFAULT_KEY_GETTER } from "@/database/BTree/BTree";
import { Comparator, KeyGetter } from "@/database/BTree/types";
import { Index } from ".";

export function PrimaryKey(
    comparator: Comparator<any> = DEFAULT_COMPARATOR,
    keyGetter: KeyGetter<any, any> = null,
    branching: number = 16
) {
    return Index(comparator, keyGetter, branching, true);
}
