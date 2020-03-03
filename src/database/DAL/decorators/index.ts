import { Comparator, KeyGetter } from "../../BTree/types";
import BTree, { DEFAULT_COMPARATOR } from "../../BTree/BTree";
import DatabaseInstance from "../database/database";
import DatabaseStore from "../database/databaseStore";


export default function Index(
    comparator: Comparator<any> = DEFAULT_COMPARATOR,
    keyGetter: KeyGetter<any, any> = undefined,
    branching: number = undefined
) {
    return (target, property) => {
        if (!keyGetter) {
            keyGetter = new Function(target.constructor.name, "return " + target.constructor.name + "['" + property + "']") as KeyGetter<any, any>;
        }

        if (!DatabaseStore.database.getTable(target.constructor.name)) {
            DatabaseStore.database.addTable(target.constructor.name)
        }

        DatabaseStore.database.getTable(target.constructor.name).addIndex(
            property,
            new BTree(branching, comparator, keyGetter)
        );
    };
}
