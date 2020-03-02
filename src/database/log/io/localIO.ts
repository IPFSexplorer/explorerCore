import { Guid } from "guid-typescript";
import io from "./IOinterface";

export default class localIO implements io {

    public static data = {}

    public static write(codec, obj, options = {}) {
        const guid = Guid.create().toString();

        localIO.data[guid] = obj
        return guid
    }

    public static read(cid, options = {}) {
        return localIO.data[cid]
    }


}

