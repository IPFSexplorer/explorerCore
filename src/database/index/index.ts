import iIndex from "./iIndex";

export default abstract class Index implements iIndex {
    static indexes: { [key: string]: Index } = {};

    static getIndex(name: string): Index {
        return this.indexes[name]; // TODO check if index exists
    }

    static addIndex(indexName: string, index: Index): void {
        this.indexes[indexName] = index;
    }

    static exists(indexName: string) {
        return this.indexes[indexName] !== undefined;
    }

    abstract find(key: any): any;
    abstract add(key: any, value: any);
}
