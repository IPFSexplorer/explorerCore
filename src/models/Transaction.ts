import { PrimaryKey } from "../database/DAL/decorators/primaryKey";
import Queriable from "../database/DAL/query/startQuery";
import { Index } from "../database/DAL/decorators";
import { DEFAULT_COMPARATOR } from "../database/BTree/BTree";

type vin = {
    n: number;
    isAddress: Boolean;
    value: number;
};

type vout = {
    n: number;
    isAddress: Boolean;
    value: number;
    addresses: string[];
};

export class Transaction extends Queriable<Transaction> {
    @PrimaryKey()
    txid: string;
    vin: vin[];
    vout: vout[];
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

    @Index(DEFAULT_COMPARATOR, tx =>
        tx.vout.reduce((acc, vout) => (acc += parseInt(vout.value)), 0)
    )
    vout_sum: boolean;

    @Index(DEFAULT_COMPARATOR, tx =>
        tx.vin.reduce((acc, vin) => (acc += parseInt(vin.value)), 0)
    )
    vin_sum: boolean;

    constructor(data = null) {
        super("Transaction");
        if (data) {
            for (let key in data) {
                this[key] = data[key];
            }
        }
    }
}
