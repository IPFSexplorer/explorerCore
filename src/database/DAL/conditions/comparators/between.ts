import IComparator from "./IComparator";
import BTree from "../../../BTree/BTree";
import { Filter } from "../../query/types";
import DatabaseInstance from "../../database/databaseInstance";
import Database from "../../database/databaseStore";
import { DbOperation } from "../../database/DBOperations";
import LoggedTransaction from "../../database/transactions/LoggedTransaction";

export default class between implements IComparator {
    min: any;
    max: any;
    property: any;
    btree: BTree<any, any>;
    constructor(property, { min, max }, entityName) {
        this.property = property;
        this.min = min;
        this.max = max;
        this.btree = Database.selectedDatabase.getTableByName(entityName).getIndex(property);
    }

    public getFilter(): Filter<any> {
        return (e) => e[this.property] > this.min && e[this.property] < this.max;
    }

    public async traverse(btree: BTree<any, any>) {
        return btree.generatorRange(this.min, this.max);
    }
}
