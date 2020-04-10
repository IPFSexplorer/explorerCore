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

        this.totalSent +=  parseInt(vin.value);
        this.balance -=  parseInt(vin.value);

        await this.update();
    }

    public async addOutput(tx: Transaction, vout: Vout) {
        this.Transactions[tx.txid] = tx;

        this.totalReceived += parseInt(vout.value);
        this.balance +=  parseInt(vout.value);

        await this.update();
    }
}
