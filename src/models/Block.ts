import CID from "cids";
import Queriable from "../database/DAL/query/startQuery";
import { PrimaryKey } from "../database/DAL/decorators/primaryKey";
import { Index } from "../database/DAL/decorators";
import {
    DEFAULT_COMPARATOR,
    DEFAULT_KEY_GETTER
} from "../database/BTree/BTree";

export class Block extends Queriable<Block> {
    @PrimaryKey()
    hash: string;

    previousBlockHash: string;
    nextBlockHash: string;

    @Index((a, b) => a - b)
    height: number;

    confirmations: number;
    size: number;
    @Index()
    time: number;
    version: number;
    merkleRoot: string;
    nonce: string;
    bits: string;
    difficulty: number;
    @Index()
    txCount: number;
    txs: CID[];

    @Index(
        DEFAULT_COMPARATOR,
        /* key getter */ b => {
            const day = new Date(b.time * 1000).getDay();
            return day === 6 || day === 0;
        }
    )
    bol_vytazeny_cez_vikend: boolean;

    constructor(data = null) {
        super("Block");
        if (data) {
            for (let key in data) {
                this[key] = data[key];
            }
        }
    }
}
