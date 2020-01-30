import Queriable from "@/database/DAL/query/startQuery";

export class Block extends Queriable<Block> {
    height: number;

    constructor() {
        super("block");
    }
}
