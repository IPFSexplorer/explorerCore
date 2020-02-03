import Blocks from "./BlockGetter";
const MAX_BLOCK_HEIGHT = 1000;

export default class Transactions implements Iterable<any> {
    private blockIterator: Blocks;
    private blockHeight: number = 1;
    private txIdx: number = 0;
    private block;

    constructor() {
        this.blockIterator = new Blocks();
        this.block = this.blockIterator[0];
    }

    public [Symbol.iterator]() {
        return {
            next: function(): IteratorResult<any> {
                return {
                    done: this.blockHeight > MAX_BLOCK_HEIGHT,
                    value: this.getTransaction()
                };
            }.bind(this)
        };
    }

    private getTransaction() {
        if (this.block.txs.length === this.txIdx + 1) {
            let retVal = this.block.txs[this.txIdx];
            this.blockHeight++;
            this.block = this.blockIterator[this.blockHeight];
            return retVal;
        } else {
            return this.block.txs[this.txIdx];
        }
    }
}
