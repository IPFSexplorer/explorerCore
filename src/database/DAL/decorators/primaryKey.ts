
import Index from ".";
import { Comparator, KeyGetter } from "../../BTree/types";
import { DEFAULT_COMPARATOR } from "../../BTree/BTree";
import Database from "../database/databaseStore";

export default function PrimaryKey(
    comparator: Comparator<any> = DEFAULT_COMPARATOR,
    keyGetter: KeyGetter<any, any> = undefined,
    branching: number = undefined
) {
    return (target, property) => {
        Database.use(target.__DATABASE_NAME__, () => {
            if (!Database.selectedDatabase.getTable(target.constructor.name)) {
                Database.selectedDatabase.addTable(target.constructor.name)
            }

            Database.selectedDatabase.getTable(target.constructor.name).setPrimary(property)

        })

        target.entityName = target.constructor.name
        return Index(comparator, keyGetter, branching)(target, property);
    }
}
