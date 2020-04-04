import { Queriable, PrimaryKey } from "explorer-core/src";
import Address from "./Address";

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

        async function findOrCreateAddress(addr: string) {
            const a = await new Address().find(addr);
            return a ? a : new Address({ address: addr });
        }

        for (const vin of this.vin) {
            if (vin.isAddress) {
                for (const addr of vin.addresses) {
                    tasks.push(
                        (async () => {
                            await (
                                await findOrCreateAddress(addr)
                            ).addInput(this, vin);
                        })(),
                    );
                }
            }
        }

        for (const vout of this.vout) {
            if (vout.isAddress) {
                for (const addr of vout.addresses) {
                    tasks.push(
                        (async () => {
                            await (
                                await findOrCreateAddress(addr)
                            ).addOutput(this, vout);
                        })(),
                    );
                }
            }
        }

        await Promise.all(tasks);
        await super.save();
    }
}
