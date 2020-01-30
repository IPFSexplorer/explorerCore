import PropertyCondition from "../conditions/propertyCondition";
import IndexStore from "../indexes/indexStore";

enum ConditionTypes {
    And,
    Or
}

export default class QueryPlanner {
    conditions: {
        condition: PropertyCondition;
        type: ConditionTypes;
        results: Set<any>;
    }[] = [];

    entityName: string;

    constructor(entityName: string) {
        this.entityName = entityName;
    }

    public addAndCondition(condition: PropertyCondition) {
        this.conditions.push({
            condition,
            type: ConditionTypes.And,
            results: new Set()
        });
    }

    public addOrCondition(condition: PropertyCondition) {
        this.conditions.push({
            condition,
            type: ConditionTypes.Or,
            results: new Set()
        });
    }

    public execute() {
        for (const cond of this.conditions) {
            const btree = IndexStore.getIndex(
                this.entityName,
                cond.condition.property
            );

            for (const result of cond.condition.comparator.getIterator(btree)) {
                cond.results.add(result);
            }
        }

        // TODO make benchmark
        // let result = new Set;
        // for (const set of array)
        //     for (const element of set)
        //         result.add(element);

        const results = new Set(
            (function* () {
                for (const cond of this.conditions) yield* cond.results;
            }.bind(this))()
        );

        return results;
    }
}
