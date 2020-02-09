import Queriable from "@/database/DAL/query/startQuery";
import { PrimaryKey } from "@/database/DAL/decorators/primaryKey";
import { Index } from "@/database/DAL/decorators";

export class Block extends Queriable<Block> {
    @PrimaryKey()
    hash;

    previousBlockHash;
    nextBlockHash;

    @Index(
        (a, b) => a - b,
        h => h * 2,
        32
    )
    height;

    confirmations;
    size;
    time;
    version;
    merkleRoot;
    nonce;
    bits;
    difficulty;
    txCount;
    txs;
    blockHash;
    blockHeight;
    blockTime;
    value;
    valueIn;
    fees;

    constructor(data = null) {
        super("block");
        if (data) {
            for (let key in data) {
                this[key] = data[key];
            }
        }
    }
}
