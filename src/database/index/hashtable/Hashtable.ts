
import { CID } from "typestub-ipfs";
import IndexBase from '../IndexBase';
import DAG from '@/ipfs/DAG';

export default class HashtableIndex extends IndexBase {
    public hashtable = {};

    constructor(name: string, iterator: any, key: string | number) {
        super(name, iterator, key);
    }

    public async Create(): Promise<Boolean> {
        for (const object of this.iterator) {
            const cid: CID = await DAG.PutAsync(object);
            this.hashtable[object[this.key]] = cid;
        }

        const indexRoot: CID = await DAG.PutAsync(this.hashtable);
        return await this.Publish(indexRoot);
    }
}
