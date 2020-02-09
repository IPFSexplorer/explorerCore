
import CID from 'cids';
import Queriable from "../database/DAL/query/startQuery";
import { PrimaryKey } from "../database/DAL/decorators/primaryKey";
import { Index } from "../database/DAL/decorators";

export class Block extends Queriable<Block> {
    @PrimaryKey()
    hash: string;

    previousBlockHash: string;
    nextBlockHash: string;

    @Index()
    height: number;

    confirmations: number;
    size: number;
    @Index()
    time: number;
    version: number;
    merkleRoot: string;
    nonce: string;
    bits: string;
    difficulty: number;
    @Index()
    txCount: number;
    txs: CID[]

    constructor(data = null) {
        super("Block");
        if (data) {
            for (let key in data) {
                this[key] = data[key];
            }
        }
    }
}
