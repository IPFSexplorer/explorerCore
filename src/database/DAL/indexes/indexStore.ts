import logger from "@/logger";
import BTree from "@/database/index/bTree/BTree";

export default abstract class IndexStore {
    static indexes: {
        [table: string]: { [property: string]: BTree<any, any> };
    } = {};

    static getIndex(table: string, property: string): BTree<any, any> {
        if (this.indexes[table] === undefined) {
            logger.error("Entity does not exsitss");
            throw "Entity does not exists";
        }
        if (this.indexes[table][property] !== undefined)
            return this.indexes[table][property];
        else return this.indexes[table]["primary"];
    }

    static addIndex(
        table: string,
        property: string,
        index: BTree<any, any>
    ): void {
        if (!this.indexes[table]) {
            this.indexes[table] = {};
        }
        this.indexes[table][property] = index;
    }
}
