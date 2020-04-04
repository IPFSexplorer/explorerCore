import { Queriable, PrimaryKey, Index } from "explorer-core/src";
import Transaction from "./Transaction";

export default class Address extends Queriable<Address> {
    @PrimaryKey() address: string;
    balance = 0;
    totalReceived = 0;
    totalSent = 0;
    Transactions: { [property: string]: Transaction } = {};

    constructor(init?: Partial<Address>) {
        super(init);
    }

    public async addInput(tx: Transaction, vin: Vin) {
        this.Transactions[tx.txid] = tx;

        this.totalSent += vin.value;
        this.balance - vin.value;

        this.save();
    }

    public async addOutput(tx: Transaction, vin: Vout) {
        this.Transactions[tx.txid] = tx;

        this.totalReceived += vin.value;
        this.balance + vin.value;

        this.save();
    }
}
