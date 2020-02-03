import AfterConditionQuery from "../query/afterConditionQuery";
import QueryPlanner from "../planners/queryPlanner";
import IComparator from "./comparators/IComparator";
import greatherThan from "./comparators/greatherThan";
import lessThan from "./comparators/lessThan";
import equal from "./comparators/equal";
import between from "./comparators/between";

export default class PropertyCondition {
    public property: string;
    public value: any;
    private queryPlanner: QueryPlanner;
    public comparator: IComparator;
    constructor(property: string, queryPlanner: QueryPlanner) {
        this.property = property;
        this.queryPlanner = queryPlanner;
    }

    public greatherThan(value) {
        this.value = value;
        this.comparator = new greatherThan(
            this.property,
            value,
            this.queryPlanner.entityName
        );
        return new AfterConditionQuery(this.queryPlanner);
    }

    public lessThan(value) {
        this.value = value;
        this.comparator = new lessThan(
            this.property,
            value,
            this.queryPlanner.entityName
        );
        return new AfterConditionQuery(this.queryPlanner);
    }

    public equal(value) {
        this.value = value;
        this.comparator = new equal(
            this.property,
            value,
            this.queryPlanner.entityName
        );
        return new AfterConditionQuery(this.queryPlanner);
    }

    public between(min, max) {
        this.value = { min, max };
        this.comparator = new between(
            this.property,
            this.value,
            this.queryPlanner.entityName
        );
        return new AfterConditionQuery(this.queryPlanner);
    }
}
