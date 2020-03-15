import EntryIndex from "./entry-index";

export default class TimeIndex extends EntryIndex
{
    set(k, v)
    {
        if (this._cache[k] === undefined)
        {
            this._cache[k] = { [v.hash]: v };
        } else
        {
            this._cache[k][v.hash] = v;
        }
    }

    get(k)
    {
        return Object.values(this._cache[k]);
    }

    get length()
    {
        return Object.values(this._cache).length;
    }
}