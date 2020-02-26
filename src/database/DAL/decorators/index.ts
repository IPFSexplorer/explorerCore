/* eslint-disable prettier/prettier */
import IndexStore from "../indexes/indexStore";
import { Comparator, KeyGetter } from "../../BTree/types";
import BTree, { DEFAULT_COMPARATOR } from "../../BTree/BTree";


export function Index(
    comparator: Comparator<any> = DEFAULT_COMPARATOR,
    keyGetter: KeyGetter<any, any> = undefined,
    branching: number = undefined,
    primary: boolean = false
) {
    return (target, property) => {
        if (!keyGetter) {
            keyGetter = new Function(target.constructor.name, "return " + target.constructor.name + "['" + property + "']") as KeyGetter<any, any>;
        }

        IndexStore.addIndex(
            target.constructor.name,
            property,
            new BTree(branching, comparator, keyGetter),
            primary
        );
    };
}
