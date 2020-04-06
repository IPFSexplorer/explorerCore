import Transaction from "./Transaction";
import Queriable from "../database/DAL/query/queriable";
import PrimaryKey from "../database/DAL/decorators/primaryKey";
import "./types";

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

        this.update();
    }

    public async addOutput(tx: Transaction, vin: Vout) {
        this.Transactions[tx.txid] = tx;

        this.totalReceived += vin.value;
        this.balance + vin.value;

        await this.update();
    }
}
