import { Comparator, KeyGetter } from "../../BTree/types";
import { DEFAULT_COMPARATOR } from "../../BTree/BTree";


export default function Index(
    comparator: Comparator<any> = DEFAULT_COMPARATOR,
    keyGetter: KeyGetter<any, any> = undefined,
    branching: number = undefined
) {
    return (target, property) => {
        if (!keyGetter) {
            keyGetter = new Function(target.constructor.name, "return " + target.constructor.name + "['" + property + "']") as KeyGetter<any, any>;
        }

        if (!target.__INDEXES__) {
            target.__INDEXES__ = {
                primary: null,
                indexes: {}
            }
        }
        target.__INDEXES__.indexes[property] = {
            property,
            branching,
            comparator,
            keyGetter
        }
    };
}
