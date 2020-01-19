import { QueryConfig } from "../query/query";
import iIndex from "./iIndex";

export default abstract class Index implements iIndex {
    private query: QueryConfig;
    static indexes: { string: Index };

    static getIndex(name: string): Index {
        return new this.indexes[name](); // TODO check if index exists
    }

    static addIndex(indexName: string, index: Index): void {
        this.indexes[indexName] = index;
    }

    setQuery(queryConfig: QueryConfig): Index {
        this.query = queryConfig;
        return this;
    }

    all(): any[] {
        return [this.find(this.query)];
    }

    abstract find(key: any): any;
    abstract add(key: any, value: any);
}
