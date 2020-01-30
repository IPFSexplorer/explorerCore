import { BPlusTree } from "@/database/index/bTree/BTree";

export default abstract class IndexStore {
    static indexes: {
        [table: string]: { [property: string]: BPlusTree<any, any> };
    } = {};

    static getIndex(table: string, property: string): BPlusTree<any, any> {
        if (this.indexes[table][property] !== undefined)
            return this.indexes[table][property];
        else return this.indexes[table]["primary"];
    }

    static addIndex(
        table: string,
        property: string,
        index: BPlusTree<any, any>
    ): void {
        if (!this.indexes[table]) {
            this.indexes[table] = {};
        }
        this.indexes[table][property] = index;
    }

    static exists(indexName: string) {
        return this.indexes[indexName] !== undefined;
    }
}
