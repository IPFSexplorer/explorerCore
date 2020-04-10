import QueryPlanner from "../planners/queryPlanner";
import { Filter } from "./types";
import Log from "../../log/log";
import Queriable from "./queriable";
import Entry from "../../log/entry";

export default class BaseQuery<T> {
    protected _queryPlanner: QueryPlanner;

    get queryPlanner() {
        if (!this._queryPlanner) this._queryPlanner = new QueryPlanner((this as any) as Queriable<T>);
        return this._queryPlanner;
    }

    set queryPlanner(qp) {
        this._queryPlanner = qp;
    }

    public async all(): Promise<Array<Promise<T>>> {
        return await this.queryPlanner.getAll();
    }

    public async first(): Promise<T> {
        return await this.queryPlanner.getFirst();
    }

    public skip(skip: number) {
        this.queryPlanner.skip = skip;
        return this;
    }

    public async take(limit: number): Promise<Array<Promise<T>>> {
        return await this.queryPlanner.take(limit);
    }

    public async paginate(perPage: number) {
        return await this.queryPlanner.paginate(perPage);
    }

    public async iterate() {
        return await this.queryPlanner.iterate();
    }

    public filter(filter: Filter<T>) {
        this.queryPlanner.addFilter(filter);
        return this;
    }
}
