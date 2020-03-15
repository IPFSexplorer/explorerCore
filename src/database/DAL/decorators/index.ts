import { Comparator, KeyGetter } from "../../BTree/types";
import { DEFAULT_COMPARATOR } from "../../BTree/BTree";
import IndexMap from "../indexMap";


export default function Index(
    comparator: Comparator<any> = DEFAULT_COMPARATOR,
    keyGetter: KeyGetter<any, any> = undefined,
    branching: number = undefined
)
{
    return (target, property) =>
    {
        IndexMap.registerIndex(target, property, { branching, comparator, keyGetter });
    };
}
