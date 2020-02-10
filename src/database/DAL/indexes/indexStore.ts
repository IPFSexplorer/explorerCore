import { EntityIndexes } from "./entitityIndexes";
import BTree from "../../BTree/btree";
import logger from "../../../logger";
import PubSub from "../../../ipfs/PubSub";
import DAG from "../../../ipfs/DAG";

export const EXPLORER_TOPIC = "explorer_topic";
export let entityIndexes: {
    [table: string]: EntityIndexes;
} = {};

export default abstract class IndexStore {


    static getIndex(table: string, property: string): BTree<any, any> {
        if (entityIndexes[table] === undefined) {
            logger.error("Entity does not exsits");
            throw "Entity does not exists";
        }
        return entityIndexes[table].getIndex(property);
    }

    static getPrimaryIndex(table: string) {
        return entityIndexes[table].getPrimaryIndex();
    }

    static getIndexesForEntity(
        table: string
    ): { [property: string]: BTree<any, any> } {
        if (entityIndexes[table] === undefined) {
            logger.error("Entity does not exsits");
            throw "Entity does not exists";
        }
        return entityIndexes[table].getIndexes();
    }

    static updateIndex(
        table: string,
        property: string,
        index: BTree<any, any>
    ) {
        entityIndexes[table].updateIndex(property, index);
    }

    static addIndex(
        table: string,
        property: string,
        index: BTree<any, any>,
        isPrimary: Boolean = false
    ): void {
        if (!entityIndexes[table]) {
            entityIndexes[table] = new EntityIndexes();
        }

        entityIndexes[table].addIndex(property, index);

        if (isPrimary) {
            entityIndexes[table].setPrimary(property);
        }
    }

    static async startSync() {
        await PubSub.subscribe(EXPLORER_TOPIC, IndexStore.sync);
    }

    static async sync(data) {
        let serializedIndexStore: {
            [key: string]: EntityIndexes;
        } = await DAG.GetAsync(data.data.toString());

        entityIndexes = {};
        for (const key in serializedIndexStore) {
            entityIndexes[key] = new EntityIndexes().fromJSON(
                serializedIndexStore[key]
            );
        }
    }

    static async publish() {
        let serialized = {};
        for (const key in entityIndexes) {
            serialized[key] = entityIndexes[key].toJSON();
        }

        const newDBRoot = (await DAG.PutAsync(serialized)).toString();
        logger.info(newDBRoot);
        await PubSub.publish(EXPLORER_TOPIC, newDBRoot);
        return newDBRoot;
    }
}
