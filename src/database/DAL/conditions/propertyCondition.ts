import AfterConditionQuery from "../query/afterConditionQuery";
import QueryPlanner from "../planners/queryPlanner";
import IComparator from "./comparators/IComparator";
import greatherThan from "./comparators/greatherThan";

export default class PropertyCondition {
    public property: string;
    public value: any;
    private queryPlanner: QueryPlanner;
    public comparator: IComparator;
    constructor(property: string, queryPlanner: QueryPlanner) {
        this.property = property;
        this.queryPlanner = queryPlanner;
    }

    public gt(value) {
        this.value = value;
        this.comparator = new greatherThan(
            this.property,
            value,
            this.queryPlanner.entityName
        );
        return new AfterConditionQuery(this.queryPlanner);
    }
}
