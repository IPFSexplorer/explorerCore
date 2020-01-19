import Queriable from "@/database/query/query";

export class Block extends Queriable<Block> {
    height: number;

    constructor() {
        super("block");
    }
}
