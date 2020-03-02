
import Index from ".";
import { Comparator, KeyGetter } from "../../BTree/types";
import { DEFAULT_COMPARATOR } from "../../BTree/BTree";
import Database from "../database/database";

export default function PrimaryKey(
    comparator: Comparator<any> = DEFAULT_COMPARATOR,
    keyGetter: KeyGetter<any, any> = undefined,
    branching: number = undefined
) {
    return (target, property) => {
        if (!Database.getTable(target.constructor.name)) {
            Database.addTable(target.constructor.name)
        }

        Database.getTable(target.constructor.name).setPrimary(property)

        target.entityName = target.constructor.name
        return Index(comparator, keyGetter, branching)(target, property);
    }
}
