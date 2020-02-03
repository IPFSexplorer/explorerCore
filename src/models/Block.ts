import Queriable from "@/database/DAL/query/startQuery";

export class Block extends Queriable<Block> {
    hash;
    previousBlockHash;
    nextBlockHash;
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
