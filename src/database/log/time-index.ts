import EntryIndex from "./entry-index"

export default class TimeIndex extends EntryIndex {
    set(k, v) {
        if (this._cache[k] === undefined) {
            this._cache[k] = [v];
        } else {
            this._cache[k].push(v);
        }
    }

    get length() {
        return Object.values(this._cache).length;
    }
}