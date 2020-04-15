import PrimaryKey from "../database/DAL/decorators/primaryKey";
import Queriable from "../database/DAL/query/queriable";
import "./types";
import Index from "../database/DAL/decorators";

export default class Transaction extends Queriable<Transaction> {
    @PrimaryKey() txid: string;
    version: number;
    lockTime: number;
    vin: Vin[];
    vout: Vout[];
    blockHash: string;
    @Index() blockHeight: number;
    confirmations: number;
    blockTime: number;
    size: number;
    value: number;
    valueIn: number;
    fees: number;
    hex: string;
    rbf: boolean;
    tokenTransfers: TokenTransfer[];
    ethereumSpecific: EthereumSpecific;

    @Index(undefined, (tx: BlockbookTx) => 
        [
            ...tx.vin
                .filter((vin) => vin.isAddress)
                .map((vin) => vin.addresses)
                .reduce((acc, curr) => acc.concat(curr), []),
            ...tx.vout
                .filter((vout) => vout.isAddress)
                .map((vout) => vout.addresses)
                .reduce((acc, curr) => acc.concat(curr), []),
        ]
    )
    address: any;

    constructor(init?: Partial<Transaction>) {
        super(init);
    }
    static fromBlockbook(tx: BlockbookTx) {
        return new Transaction(tx);
    }

    public async save(): Promise<void> {
        const tasks: Promise<void>[] = [];

        tasks.push(super.save());

        await Promise.all(tasks);
        console.log("transaction in block " + this.blockHeight + " saved");
    }
}
