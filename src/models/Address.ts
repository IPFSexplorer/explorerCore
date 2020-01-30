import logger from "../logger";
import Queriable from "@/database/DAL/query/startQuery";

export class Address extends Queriable<Address> {
    constructor() {
        super("address");
        logger.info("Address");
    }
}
