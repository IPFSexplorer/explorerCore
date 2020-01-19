import IndexBase from "../IndexBase";
import { CID } from "typestub-ipfs";
import DAG from '@/ipfs/DAG';

const KEY_LENGTH = 4;

export default class ReverseLookup extends IndexBase {
    public hashtable = {};
    private keyMaxLength: number;

    constructor(
        name: string,
        iterator: any,
        key: string | number,
        keyMaxLength: number
    ) {
        super(name, iterator, key);
        this.keyMaxLength = keyMaxLength;
    }

    public async Create(): Promise<Boolean> {
        for (const object of this.iterator) {
            const cid: CID = await DAG.PutAsync(object);
            let key: string = object[this.key].toString();
            while (key.length < this.keyMaxLength) {
                key = "0" + key;
            }
            key = key
                .toString()
                .split("")
                .reverse()
                .join("");

            let table = this.hashtable;
            for (; key.length > KEY_LENGTH; key = key.slice(KEY_LENGTH)) {
                let subKey = key.substr(0, KEY_LENGTH);
                table = this.getOrCreateSubTable(table, subKey);
            }
            table[key] = cid;
        }

        const indexRoot: CID = await this.saveSubTableAsDag(
            this.hashtable,
            this.keyMaxLength / KEY_LENGTH - 1
        );
        return await this.Publish(indexRoot);
    }

    private getOrCreateSubTable(table, key) {
        if (table[key] === undefined) {
            table[key] = {};
        }
        return table[key];
    }

    private async saveSubTableAsDag(table, numberOfNestesTables: number) {
        if (numberOfNestesTables === 0) {
            return await DAG.PutAsync(table);
        } else {
            let tasks: any[] = [];
            for (const subKey in table) {
                tasks.push(
                    new Promise(async (resolve, reject) => {
                        resolve({
                            cid: await this.saveSubTableAsDag(
                                table[subKey],
                                numberOfNestesTables - 1
                            ),
                            key: subKey
                        });
                    })
                );
            }

            await Promise.all(tasks).then((results: any) => {
                for (const result of results) {
                    table[result.key] = result.cid;
                }
            });
            // logger.info("inserting " + numberOfNestesTables)
            return await DAG.PutAsync(table);
        }
    }
}
