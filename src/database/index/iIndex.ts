import Index from ".";
import { QueryConfig } from "../query/query";

export default interface iIndex {
    setQuery(queryConfig: QueryConfig): Index;
    find(key: any): any;
    add(key: any, value: any);
}
