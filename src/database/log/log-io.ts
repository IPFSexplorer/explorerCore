import Entry from "./entry";
import EntryIO from "./entry-io";
import { LastWriteWins, NoZeroes } from "./log-sorting";
import { isDefined } from "./utils/is-defined";
import { findUniques } from "./utils/find-uniques";

import { difference } from "./utils/difference";
import { IPFSNotDefinedError, LogNotDefinedError, NotALogError } from "./log-errors";
import { write, read } from "./io";
import Log from "./log";

const IPLD_LINKS = ["heads"];
const last = (arr, n) => arr.slice(arr.length - Math.min(arr.length, n), arr.length);

export default class LogIO {
    //
    /**
     * Get the multihash of a Log.
     * @param {IPFS} ipfs An IPFS instance
     * @param {Log} log Log to get a multihash for
     * @returns {Promise<string>}
     * @deprecated
     */
    static async toMultihash(log: Log, { format = undefined } = {}) {
        if (!isDefined(log)) throw LogNotDefinedError();
        if (!isDefined(format)) format = "dag-cbor";

        return write(format, log.toJSON(), { links: IPLD_LINKS });
    }

    /**
     * Create a log from a hashes.
     * @param {IPFS} ipfs An IPFS instance
     * @param {string} hash The hash of the log
     * @param {Object} options
     * @param {number} options.length How many items to include in the log
     * @param {Array<Entry>} options.exclude Entries to not fetch (cached)
     * @param {function(hash, entry, parent, depth)} options.onProgressCallback
     */
    static async fromMultihash(hash, { length = -1, exclude = [], timeout, concurrency, sortFn, onProgressCallback }) {
        if (!isDefined(hash)) throw new Error(`Invalid hash: ${hash}`);

        const logData = await read(hash, { links: IPLD_LINKS });

        if (!logData.heads || !logData.id) throw NotALogError();

        // Use user provided sorting function or the default one
        sortFn = sortFn || NoZeroes(LastWriteWins);
        //const isHead = (e) => logData.heads.includes(e.hash);

        // const all = await EntryIO.fetchAll(logData.heads, {
        //     length,
        //     exclude,
        //     timeout,
        //     concurrency,
        //     onProgressCallback,
        // });

        const logId = logData.id;
        // const entries =
        //     length > -1 ? last(all.sort(sortFn), length) : all;
        //const heads = entries.filter(isHead);

        // TODO: remove ", head: logData.head "
        return { logId, entries: null, heads: logData.heads, head: logData.head };
    }

    /**
     * Create a log from an entry hash.
     * @param {IPFS} ipfs An IPFS instance
     * @param {string} hash The hash of the entry
     * @param {Object} options
     * @param {number} options.length How many items to include in the log
     * @param {Array<Entry>} options.exclude Entries to not fetch (cached)
     * @param {function(hash, entry, parent, depth)} options.onProgressCallback
     */
    static async fromEntryHash(hash, { length = -1, exclude = [], timeout, concurrency, sortFn, onProgressCallback }) {
        if (!isDefined(hash)) throw new Error("'hash' must be defined");
        // Convert input hash(s) to an array
        const hashes = Array.isArray(hash) ? hash : [hash];
        // Fetch given length, return size at least the given input entries
        length = length > -1 ? Math.max(length, 1) : length;
        const all = await EntryIO.fetchParallel(hashes, {
            length,
            exclude,
            timeout,
            concurrency,
            onProgressCallback,
        });
        // Cap the result at the right size by taking the last n entries,
        // or if given length is -1, then take all
        sortFn = sortFn || NoZeroes(LastWriteWins);
        const entries = length > -1 ? last(all.sort(sortFn), length) : all;
        return { entries };
    }

    /**
     * Creates a log data from a JSON object, to be passed to a Log constructor
     *
     * @param {IPFS} ipfs An IPFS instance
     * @param {json} json A json object containing valid log data
     * @param {Object} options
     * @param {number} options.length How many entries to include
     * @param {function(hash, entry, parent, depth)} options.onProgressCallback
     **/
    static async fromJSON(json, { length = -1, timeout, concurrency, onProgressCallback }) {
        const { id, heads } = json;
        const headHashes = heads.map((e) => e.hash);
        const all = await EntryIO.fetchParallel(headHashes, {
            length,
            timeout,
            concurrency,
            onProgressCallback,
        });
        const entries = all.sort(Entry.compare);
        return { logId: id, entries, heads };
    }

    /**
     * Create a new log starting from an entry.
     * @param {IPFS} ipfs An IPFS instance
     * @param {Entry|Array<Entry>} sourceEntries An entry or an array of entries to fetch a log from
     * @param {Object} options
     * @param {number} options.length How many entries to include
     * @param {Array<Entry>} options.exclude Entries to not fetch (cached)
     * @param {function(hash, entry, parent, depth)} options.onProgressCallback
     */
    static async fromEntry(sourceEntries, { length = -1, exclude = [], timeout, concurrency, onProgressCallback }) {
        if (!isDefined(sourceEntries)) throw new Error("'sourceEntries' must be defined");

        // Make sure we only have Entry objects as input
        if (!Array.isArray(sourceEntries) && !Entry.isEntry(sourceEntries)) {
            throw new Error(`'sourceEntries' argument must be an array of Entry instances or a single Entry`);
        }

        if (!Array.isArray(sourceEntries)) {
            sourceEntries = [sourceEntries];
        }

        // Fetch given length, return size at least the given input entries
        length = length > -1 ? Math.max(length, sourceEntries.length) : length;

        // Make sure we pass hashes instead of objects to the fetcher function
        const hashes = sourceEntries.map((e) => e.hash);

        // Fetch the entries
        const all = await EntryIO.fetchParallel(hashes, {
            length,
            exclude,
            timeout,
            concurrency,
            onProgressCallback,
        });

        // Combine the fetches with the source entries and take only uniques
        const combined = sourceEntries.concat(all).concat(exclude);
        const uniques = findUniques(combined, "hash").sort(Entry.compare);

        // Cap the result at the right size by taking the last n entries
        const sliced = uniques.slice(length > -1 ? -length : -uniques.length);

        // Make sure that the given input entries are present in the result
        // in order to not lose references
        const missingSourceEntries = difference(sliced, sourceEntries, "hash");

        const replaceInFront = (a, withEntries) => {
            var sliced = a.slice(withEntries.length, a.length);
            return withEntries.concat(sliced);
        };

        // Add the input entries at the beginning of the array and remove
        // as many elements from the array before inserting the original entries
        const entries = replaceInFront(sliced, missingSourceEntries);
        const logId = entries[entries.length - 1].id;
        return { logId, entries };
    }
}
