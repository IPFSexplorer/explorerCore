import Index from ".";
import { Comparator, KeyGetter } from "../../BTree/types";
import { DEFAULT_COMPARATOR } from "../../BTree/BTree";

export default function PrimaryKey(
    comparator: Comparator<any> = DEFAULT_COMPARATOR,
    keyGetter: KeyGetter<any, any> = undefined,
    branching: number = undefined
) {
    return (target, property) => {

        target.__TABLE_NAME__ = target.constructor.name
        if (!target.__INDEXES__) {
            target.__INDEXES__ = {
                primary: null,
                indexes: {}
            }
        }
        target.__INDEXES__.primary = property
        return Index(comparator, keyGetter, branching)(target, property);
    }
}
