import logger from "@/logger";
import BTree from "@/database/BTree/BTree";
import { EntityIndexes } from "./entitityIndexes";

export default abstract class IndexStore {
    static indexes: {
        [table: string]: EntityIndexes;
    } = {};

    static getIndex(table: string, property: string): BTree<any, any> {
        if (this.indexes[table] === undefined) {
            logger.error("Entity does not exsits");
            throw "Entity does not exists";
        }
        return this.indexes[table].getIndex(property);
    }

    static getPrimaryIndex(table: string) {
        return this.indexes[table].getPrimaryIndex()
    }

    static getIndexesForEntity(
        table: string
    ): { [property: string]: BTree<any, any> } {
        if (this.indexes[table] === undefined) {
            logger.error("Entity does not exsits");
            throw "Entity does not exists";
        }
        return this.indexes[table].getIndexes();
    }

    static updateIndex(
        table: string,
        property: string,
        index: BTree<any, any>
    ) {
        this.indexes[table].updateIndex(property, index);
    }

    static addIndex(
        table: string,
        property: string,
        index: BTree<any, any>,
        isPrimary: Boolean = false
    ): void {
        if (!this.indexes[table]) {
            this.indexes[table] = new EntityIndexes(table);
        }

        this.indexes[table].addIndex(property, index);

        if (isPrimary) {
            this.indexes[table].setPrimary(property);
        }
    }
}
