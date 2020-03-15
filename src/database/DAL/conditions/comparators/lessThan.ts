import IComparator from "./IComparator";
import BTree from "../../../BTree/btree";
import { Filter } from "../../query/types";
import DatabaseInstance from "../../database/databaseInstance";
import Database from "../../database/databaseStore";
import Transaction from "../../database/transactions/Transaction";
import { DbOperation } from "../../database/DBOperations";

export default class lessThan implements IComparator
{
    value: any;
    property: any;
    btree: BTree<any, any>;
    constructor(property, value, entityName)
    {
        this.property = property;
        this.value = value;
        this.btree = Database.selectedDatabase.getTableByName(entityName).getIndex(property);
    }

    public getFilter(): Filter<any>
    {
        return e => e[this.property] < this.value;
    }

    public async traverse(btree: BTree<any, any>)
    {
        const tx = new Transaction({ operation: DbOperation.Read, data: () => btree.generatorLess(this.value) });
        return await Database.selectedDatabase.processTransaction(tx);
    }
}
