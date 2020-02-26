import "reflect-metadata";
import { container } from "tsyringe";
import ipfsBtreeNodeChildren from "./database/BTree/children/ipfsChildren";
import BTree from "./database/BTree/BTree";

container.register("BtreeNodeChildren", {
    useClass: ipfsBtreeNodeChildren
});

export default BTree