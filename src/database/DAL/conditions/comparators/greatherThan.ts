import IComparator from "./IComparator";
import BTree from "../../../BTree/BTree";
import { Filter } from "../../query/types";
import DatabaseInstance from "../../database/databaseInstance";
import Database from "../../database/databaseStore";
import { DbOperation } from "../../database/DBOperations";
import LoggedTransaction from "../../database/transactions/LoggedTransaction";

export default class greatherThan implements IComparator {
    value: any;
    property: any;
    btree: BTree<any, any>;
    constructor(property, value, entityName) {
        this.property = property;
        this.value = value;
        this.btree = Database.selectedDatabase.getTableByName(entityName).getIndex(property);
    }

    public getFilter(): Filter<any> {
        return (e) => e[this.property] > this.value;
    }

    public async traverse(btree: BTree<any, any>) {
        return btree.generatorGreather(this.value);
    }
}
