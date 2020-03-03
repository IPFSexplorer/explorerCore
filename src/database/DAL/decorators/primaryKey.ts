
import Index from ".";
import { Comparator, KeyGetter } from "../../BTree/types";
import { DEFAULT_COMPARATOR } from "../../BTree/BTree";
import DatabaseInstance from "../database/database";
import DatabaseStore from "../database/databaseStore";

export default function PrimaryKey(
    comparator: Comparator<any> = DEFAULT_COMPARATOR,
    keyGetter: KeyGetter<any, any> = undefined,
    branching: number = undefined
) {
    return (target, property) => {
        if (!DatabaseStore.database.getTable(target.constructor.name)) {
            DatabaseStore.database.addTable(target.constructor.name)
        }

        DatabaseStore.database.getTable(target.constructor.name).setPrimary(property)

        target.entityName = target.constructor.name
        return Index(comparator, keyGetter, branching)(target, property);
    }
}
