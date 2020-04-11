import PrimaryKey from "../database/DAL/decorators/primaryKey";
import Index from "../database/DAL/decorators/index";
import Queriable from "../database/DAL/query/queriable";
import "./types";

export default class Block extends Queriable<Block> {
    @PrimaryKey() hash: string;
    previousBlockHash: string;
    nextBlockHash: string;
    @Index() height: number;
    size: number;
    @Index() time: number;
    version: number;
    merkleRoot: string;
    nonce: string;
    bits: string;
    difficulty: string;

    constructor(init?: Partial<Block>) {
        super(init);
    }
    static fromBlockbook(b: BlockbookBlock) {
        delete b.txs;
        delete b.page;
        delete b.totalPages;
        delete b.itemsOnPage;
        delete b.confirmations;

        const block = new Block(b);
        return block;
    }

    public async save(): Promise<void> {
        await super.save();
        console.log("block " + this.height + " parsed");
    }
}
