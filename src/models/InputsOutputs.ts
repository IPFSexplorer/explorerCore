import Transaction from "./Transaction";
import PrimaryKey from "../database/DAL/decorators/primaryKey";
import Index from "../database/DAL/decorators/index";
import Queriable from "../database/DAL/query/queriable";
import "./types";

export enum spendingType {
    input,
    output,
}

export default class InputsOutputs extends Queriable<InputsOutputs> {
    // TODO make unique
    @PrimaryKey() address: string;
    amount: number;
    transaction: string;
    type: spendingType;
    connectedTx: string;

    constructor(init?: Partial<InputsOutputs>) {
        super(init);
    }
}
