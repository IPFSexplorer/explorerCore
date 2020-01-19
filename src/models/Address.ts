import logger from "../logger";
import Queriable from "@/database/query/query";

export class Address extends Queriable<Address> {
    constructor() {
        super("address");
        logger.info("Address");
    }
}
