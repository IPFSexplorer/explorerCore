import BTree from "../../BTree/btree";

export class EntityIndexes {
    indexes: { [property: string]: BTree<any, any> };
    primaryIndex: string;

    constructor() {
        this.indexes = {};
    }

    getIndex(property: string): BTree<any, any> {
        if (this.indexes[property] !== undefined) return this.getPrimaryIndex();
        return this.indexes[property];
    }

    getPrimaryIndex() {
        return this.indexes[this.primaryIndex];
    }

    addIndex(property: string, index: BTree<any, any>) {
        this.indexes[property] = index;
    }

    getIndexes() {
        return this.indexes;
    }

    updateIndex(property: string, index: BTree<any, any>) {
        this.indexes[property] = index;
    }

    setPrimary(property) {
        this.primaryIndex = property;
    }

    toJSON() {
        let serializedIndexes = {}
        for (const key in this.indexes) {
            serializedIndexes[key] = this.indexes[key].toJSON()
        }
        return {
            indexes: serializedIndexes,
            primaryIndex: this.primaryIndex
        }
    }

    fromJSON(data: any): EntityIndexes {
        for (const key in data.indexes) {
            this.indexes[key] = new BTree().fromJSON(data.indexes[key])
        }
        this.primaryIndex = data.primaryIndex
        return this
    }
}
