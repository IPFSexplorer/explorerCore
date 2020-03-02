import { Comparator, KeyGetter } from "../../BTree/types";
import BTree, { DEFAULT_COMPARATOR } from "../../BTree/BTree";
import Database from "../database/database";


export default function Index(
    comparator: Comparator<any> = DEFAULT_COMPARATOR,
    keyGetter: KeyGetter<any, any> = undefined,
    branching: number = undefined
) {
    return (target, property) => {
        if (!keyGetter) {
            keyGetter = new Function(target.constructor.name, "return " + target.constructor.name + "['" + property + "']") as KeyGetter<any, any>;
        }

        if (!Database.getTable(target.constructor.name)) {
            Database.addTable(target.constructor.name)
        }

        Database.getTable(target.constructor.name).addIndex(
            property,
            new BTree(branching, comparator, keyGetter)
        );
    };
}
