import { PrimaryKey } from "../database/DAL/decorators/primaryKey";
import Queriable from "../database/DAL/query/startQuery";
import { Index } from "../database/DAL/decorators";

type vin = [
    {
        n: number;
        isAddress: Boolean;
        value: number;
    }
];

type vout = [
    {
        n: number;
        isAddress: Boolean;
        value: number;
        addresses: string[];
    }
];

export class Transaction extends Queriable<Transaction> {
    @PrimaryKey()
    txid: string;
    vin: vin;
    vout: vout;
    blockHash: string;
    @Index()
    blockHeight: number;
    confirmations: number;
    @Index()
    blockTime: number;
    @Index()
    value: number;
    @Index()
    valueIn: number;
    @Index()
    fees: number;

    constructor(data = null) {
        super("Transaction");
        if (data) {
            for (let key in data) {
                this[key] = data[key];
            }
        }
    }
}
