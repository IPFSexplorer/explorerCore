/* eslint-disable prettier/prettier */
import IndexStore from "../indexes/indexStore";
import { Comparator, KeyGetter } from "../../BTree/types";
import BTree, { DEFAULT_COMPARATOR } from "../../BTree/BTree";
import { makeFunctionFromString } from "../../../common";


export function Index(
    comparator: Comparator<any> = DEFAULT_COMPARATOR,
    keyGetter: KeyGetter<any, any> = null,
    branching: number = 4,
    primary: boolean = false
) {
    return (target, property) => {
        if (keyGetter === null) {
            keyGetter = v => v["tmp"];
            keyGetter = makeFunctionFromString(keyGetter.toString().replace('tmp', property));
        }

        IndexStore.addIndex(
            target.constructor.name,
            property,
            new BTree(branching, comparator, keyGetter),
            primary
        );
    };
}
