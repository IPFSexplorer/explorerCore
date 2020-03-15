import Queriable from "./query/queriable";
import { Comparator, KeyGetter } from "../BTree/types";

type indexes = {
    primary: string,
    indexes: {
        [property: string]: {
            branching: number,
            comparator: Comparator<any>,
            keyGetter: KeyGetter<any, any>;
        };
    },
};

export default abstract class IndexMap
{
    private static entityIndexes: Map<Queriable<any>, indexes> = new Map();

    static registerIndex(target: Queriable<any>, property: any, options: {
        branching: number,
        comparator: Comparator<any>,
        keyGetter: KeyGetter<any, any>;
    }): void
    {
        if (!options.keyGetter)
        {
            options.keyGetter = new Function(target.constructor.name, "return " + target.constructor.name + "['" + property + "']") as KeyGetter<any, any>;
        }

        let indexes = this.entityIndexes.get(target);
        if (!indexes)
        {
            indexes = {
                primary: null,
                indexes: {}
            };
            this.entityIndexes.set(target, indexes);
        }
        indexes.indexes[property] = options;
    }

    static registerPrimaryIndex(target: Queriable<any>, property: any, options: {
        branching: number,
        comparator: Comparator<any>,
        keyGetter: KeyGetter<any, any>;
    }): void
    {
        this.registerIndex(target, property, options);
        this.entityIndexes.get(target).primary = property;
    }

    static getIndexes(target: Queriable<any>): indexes
    {
        return this.entityIndexes.get(Object.getPrototypeOf(target));
    }

    static getProperties(target: Queriable<any>): string[]
    {
        return Object.keys(this.entityIndexes.get(Object.getPrototypeOf(target)).indexes);
    }

    static getPrimary(target: Queriable<any>): string
    {
        return this.entityIndexes.get(Object.getPrototypeOf(target)).primary;
    }


    static validate(target: Queriable<any>)
    {
        // TODO check if we have primary key
    }
}