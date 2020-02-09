import logger from "@/logger";
import BTree from "@/database/BTree/BTree";
import { EntityIndexes } from "./entitityIndexes";
import { delay } from '@/common';
import DAG from '@/ipfs/DAG';
import PubSub from '@/ipfs/PubSub';

export const EXPLORER_TOPIC = "explorer_topic"

export default abstract class IndexStore {
    static entityIndexes: {
        [table: string]: EntityIndexes;
    } = {};

    static getIndex(table: string, property: string): BTree<any, any> {
        if (this.entityIndexes[table] === undefined) {
            logger.error("Entity does not exsits");
            throw "Entity does not exists";
        }
        return this.entityIndexes[table].getIndex(property);
    }

    static getPrimaryIndex(table: string) {
        return this.entityIndexes[table].getPrimaryIndex();
    }

    static getIndexesForEntity(
        table: string
    ): { [property: string]: BTree<any, any> } {
        if (this.entityIndexes[table] === undefined) {
            logger.error("Entity does not exsits");
            throw "Entity does not exists";
        }
        return this.entityIndexes[table].getIndexes();
    }

    static updateIndex(
        table: string,
        property: string,
        index: BTree<any, any>
    ) {
        this.entityIndexes[table].updateIndex(property, index);
    }

    static addIndex(
        table: string,
        property: string,
        index: BTree<any, any>,
        isPrimary: Boolean = false
    ): void {
        if (!this.entityIndexes[table]) {
            this.entityIndexes[table] = new EntityIndexes();
        }

        this.entityIndexes[table].addIndex(property, index);

        if (isPrimary) {
            this.entityIndexes[table].setPrimary(property);
        }
    }

    static async startSync() {
        await PubSub.subscribe(EXPLORER_TOPIC, IndexStore.sync);
    }

    static async sync(data) {
        let serializedIndexStore: {
            [key: string]: EntityIndexes;
        } = await DAG.GetAsync(data.data.toString());

        this.entityIndexes = {}
        for (const key in serializedIndexStore) {
            this.entityIndexes[key] = new EntityIndexes().fromJSON(
                serializedIndexStore[key]
            );
        }
    }

    static async publish() {
        let serialized = {}
        for (const key in this.entityIndexes) {
            serialized[key] = this.entityIndexes[key].toJSON()
        }
        await PubSub.publish(
            EXPLORER_TOPIC,
            (await DAG.PutAsync(serialized)).toString()
        );
    }
}
