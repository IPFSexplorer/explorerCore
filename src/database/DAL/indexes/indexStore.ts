import { EntityIndexes } from "./entitityIndexes";
import BTree from "../../BTree/btree";
import logger from "../../../logger";
import PubSub from "../../../ipfs/PubSub";
import DAG from "../../../ipfs/DAG";

export const EXPLORER_TOPIC = "explorer_topic";


export default abstract class IndexStore {
    private static entityIndexes: {
        [table: string]: EntityIndexes;
    } = {};


    public static getIndexes() {
        return IndexStore.entityIndexes;
    }

    static getIndex(table: string, property: string): BTree<any, any> {
        if (IndexStore.entityIndexes[table] === undefined) {
            logger.error("Entity does not exsits");
            throw "Entity does not exists";
        }
        return IndexStore.entityIndexes[table].getIndex(property);
    }

    static getPrimaryIndex(table: string) {
        return IndexStore.entityIndexes[table].getPrimaryIndex();
    }

    static getIndexesForEntity(
        table: string
    ): { [property: string]: BTree<any, any> } {
        if (IndexStore.entityIndexes[table] === undefined) {
            logger.error("Entity does not exsits");
            throw "Entity does not exists";
        }
        return IndexStore.entityIndexes[table].getIndexes();
    }

    static updateIndex(
        table: string,
        property: string,
        index: BTree<any, any>
    ) {
        IndexStore.entityIndexes[table].updateIndex(property, index);
    }

    static addIndex(
        table: string,
        property: string,
        index: BTree<any, any>,
        isPrimary: Boolean = false
    ): void {
        if (!IndexStore.entityIndexes[table]) {
            IndexStore.entityIndexes[table] = new EntityIndexes();
        }

        IndexStore.entityIndexes[table].addIndex(property, index);

        if (isPrimary) {
            IndexStore.entityIndexes[table].setPrimary(property);
        }
    }

    static async startSync() {
        await PubSub.subscribe(EXPLORER_TOPIC, IndexStore.sync);
    }

    static async sync(data) {
        let serializedIndexStore: {
            [key: string]: EntityIndexes;
        } = await DAG.GetAsync(data.data.toString());

        //IndexStore.entityIndexes = {};
        for (const key in serializedIndexStore) {
            IndexStore.entityIndexes[key] = new EntityIndexes().fromJSON(
                serializedIndexStore[key]
            );
        }
    }

    static async publish() {
        let serialized = {};
        for (const key in IndexStore.entityIndexes) {
            serialized[key] = IndexStore.entityIndexes[key].toJSON();
        }

        const newDBRoot = (await DAG.PutAsync(serialized)).toString();
        logger.info(newDBRoot);
        await PubSub.publish(EXPLORER_TOPIC, newDBRoot);
        return newDBRoot;
    }
}
