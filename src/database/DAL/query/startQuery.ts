import BaseQuery from "./baseQuery";
import PropertyCondition from "../conditions/propertyCondition";
import QueryPlanner from "../planners/queryPlanner";
import { Filter } from "./types";
import IndexStore from "../indexes/indexStore";

export default class Queriable<T> extends BaseQuery<T> {
    private entityName: string;

    constructor(entityName: string) {
        super();
        this.entityName = entityName;
        this.queryPlanner = new QueryPlanner(entityName);
    }

    public where(propertyNameOrNestedQuery): PropertyCondition {
        if (typeof propertyNameOrNestedQuery === "string") {
            const whereCondition = new PropertyCondition(
                propertyNameOrNestedQuery,
                this.queryPlanner
            );
            this.queryPlanner.addAndCondition(whereCondition);
            return whereCondition;
        }
    }

    public async save(): Promise<void> {
        const indexes = IndexStore.getIndexesForEntity(this.entityName);
        for (const key in indexes) {
            await indexes[key].save(this);
        }
    }
}
