import QueryPlanner from "../planners/queryPlanner";
import { Filter } from "./types";
import { Comparator, KeyGetter } from "../../BTree/types";

type indexes = {
    primary: string,
    indexes: {
        [property: string]: {
            property: string,
            branching: number,
            comparator: Comparator<any>,
            keyGetter: KeyGetter<any, any>;
        };
    },
};

export default class BaseQuery<T> {
    protected queryPlanner: QueryPlanner;
    public __TABLE_NAME__: string;
    public __INDEXES__: indexes;

    public async all() {
        return await this.queryPlanner.getAll();
    }

    public async first() {
        return await this.queryPlanner.getFirst();
    }

    public skip(skip: number) {

        if (skip === -1) {
            return this
        }
        this.queryPlanner.skip = skip;
        return this;
    }

    public async take(limit: number) {
        return await this.queryPlanner.take(limit);
    }

    public async paginate(perPage: number) {
        return await this.queryPlanner.paginate(perPage);
    }

    public async iterate() {
        return this.queryPlanner.iterate();
    }

    public filter(filter: Filter<T>) {
        this.queryPlanner.addFilter(filter);
        return this;
    }
}
