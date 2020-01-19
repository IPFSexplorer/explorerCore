import Index from "../index/index";

export interface QueryConfig {
    comparator: (e: Object) => boolean;
    limit: number;
}

export default class Queriable<T> {
    private entityName: string;
    private index: Index;
    private queryConfig: QueryConfig;
    private selectFunction: (e: T) => Object;

    constructor(entityName: string) {
        this.entityName = entityName;
        this.index = Index.getIndex(name);
        this.queryConfig = {
            comparator: null,
            limit: -1
        };
        this.index.setQuery(this.queryConfig);
    }

    public where(condition: (e: T) => boolean): Queriable<T> {
        this.queryConfig.comparator = condition;
        return this;
    }

    public select(select: (e: T) => Object): Queriable<any> {
        this.selectFunction = select;
        return this;
    }

    public all(): T[] {
        let results: T[] = [];
        this.resolve();
        return results;
    }

    public first(): T {
        this.limit(1);
        return this.all()[0]; //TODO check if exist
    }

    public limit(limit: number): Queriable<T> {
        this.queryConfig.limit = limit;
        return this;
    }

    protected resolve(): T[] {
        return this.index.setQuery(this.queryConfig).all();
    }

    public useIndex(index: string): Queriable<T> {
        this.index = Index.getIndex(this.entityName + "-" + name);
        return this;
    }

    // [Symbol.iterator](): Iterator<T> {}

    // public and(query: Queriable<T>): Queriable<T> {}

    // public or(query: Queriable<T>): Queriable<T> {}
}
