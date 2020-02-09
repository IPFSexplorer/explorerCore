import BTree from "@/database/BTree/BTree";

export class EntityIndexes {
    indexes: { [property: string]: BTree<any, any> };
    primaryIndex: string;
    entityName: string;

    constructor(entityName: string) {
        this.entityName = entityName;
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
}
