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

    public async all(): Promise<Array<T>> {
        return (await this.queryPlanner.getAll()).map((res) => this.resultMapper(res));
    }

    public async log(): Promise<Log> {
        const res = await this.queryPlanner.getFirst();

        return res ? (res as Log) : null;
    }

    public async first(): Promise<T> {
        const res = await this.queryPlanner.getFirst();

        return res ? this.resultMapper(res as Entry) : null;
    }

    public skip(skip: number) {
        this.queryPlanner.skip = skip;
        return this;
    }

    public async take(limit: number): Promise<Array<T>> {
        return (await this.queryPlanner.take(limit)).map((res) => this.resultMapper(res));
    }

    public async *paginate(perPage: number): AsyncGenerator<Array<T>, void, Array<T>> {
        for await (const res of this.queryPlanner.paginate(perPage)) {
            yield res.map((res) => this.resultMapper(res));
        }
    }

    public async *iterate(): AsyncGenerator<T, void, T> {
        for await (const res of this.queryPlanner.iterate()) {
            yield this.resultMapper(res as Entry);
        }
    }

    public filter(filter: Filter<T>) {
        this.queryPlanner.addFilter(filter);
        return this;
    }

    private resultMapper(res: Entry): T {
        // if (res.heads.length > 1) {
        //     return this.conflictSolver(res);
        // }

        return new this.queryPlanner.entityConstructor({
            ...res.payload,
            entry: res.hash,
        });
    }

    private conflictSolver(conflict: Log): T {
        throw Error("We got conflict");
    }
}
