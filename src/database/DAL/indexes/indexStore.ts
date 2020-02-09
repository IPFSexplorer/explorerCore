import logger from "@/logger";
import BTree from "@/database/BTree/BTree";

export default abstract class IndexStore {
    static indexes: {
        [table: string]: { [property: string]: BTree<any, any> };
    } = {};

    static getIndex(table: string, property: string): BTree<any, any> {
        if (this.indexes[table] === undefined) {
            logger.error("Entity does not exsits");
            throw "Entity does not exists";
        }
        if (this.indexes[table][property] !== undefined)
            return this.indexes[table][property];
        else return this.indexes[table]["primary"];
    }

    static getIndexesForEntity(table: string) {
        if (this.indexes[table] === undefined) {
            logger.error("Entity does not exsits");
            throw "Entity does not exists";
        }
        return this.indexes[table];
    }

    static addIndex(
        table: string,
        property: string,
        index: BTree<any, any>,
        isPrimary: Boolean = false
    ): void {
        if (!this.indexes[table]) {
            this.indexes[table] = {};
        }
        this.indexes[table][property] = index;
    }
}
