import PrimaryKey from "../database/DAL/decorators/primaryKey";
import Queriable from "../database/DAL/query/queriable";
import "./types";
import InputsOutputs, { spendingType } from "./InputsOutputs";

export default class Transaction extends Queriable<Transaction> {
    @PrimaryKey() txid: string;
    version: number;
    lockTime: number;
    vin: Vin[];
    vout: Vout[];
    blockHash: string;
    blockHeight: number;
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

    constructor(init?: Partial<Transaction>) {
        super(init);
    }
    static fromBlockbook(tx: BlockbookTx) {
        return new Transaction(tx);
    }

    public async save(): Promise<void> {
        const tasks: Promise<void>[] = [];

        for (const vin of this.vin) {
            if (vin.isAddress) {
                for (const addr of vin.addresses) {
                    tasks.push(
                        new InputsOutputs({
                            address: addr,
                            amount: parseInt(vin.value),
                            connectedTx: vin.txid,
                            transaction: this.txid,
                            type: spendingType.input,
                        }).save(),
                    );
                }
            }
        }

        for (const vout of this.vout) {
            if (vout.isAddress) {
                for (const addr of vout.addresses) {
                    tasks.push(
                        new InputsOutputs({
                            address: addr,
                            amount: parseInt(vout.value),
                            connectedTx: vout.spentTxId,
                            transaction: this.txid,
                            type: spendingType.output,
                        }).save(),
                    );
                }
            }
        }

        tasks.push(super.save());

        await Promise.all(tasks);
        console.log("transaction in block " + this.blockHeight + " saved");
    }
}
