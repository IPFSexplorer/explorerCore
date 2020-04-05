import Transaction from "./Transaction";
import PrimaryKey from "../database/DAL/decorators/primaryKey";
import Index from "../database/DAL/decorators/index";
import Queriable from "../database/DAL/query/queriable";

export default class Block extends Queriable<Block> {
    @PrimaryKey() hash: string;
    previousBlockHash: string;
    nextBlockHash: string;
    @Index() height: number;
    confirmations: number;
    size: number;
    @Index() time: number;
    version: number;
    merkleRoot: string;
    nonce: string;
    bits: string;
    difficulty: string;
    Transactions: { [hash: string]: Transaction } = {};

    constructor(init?: Partial<Block>) {
        super(init);
    }
    static fromBlockbook(b: BlockbookBlock) {
        const block = new Block(b);
        for (const tx of b.txs) {
            block.Transactions[tx.txid] = Transaction.fromBlockbook(tx);
        }
        return block;
    }

    public async save(): Promise<void> {
        const tasks: Promise<void>[] = [];
        for (const txid in this.Transactions) {
            tasks.push(this.Transactions[txid].save());
        }

        await Promise.all(tasks);
        await super.save();
    }
}
