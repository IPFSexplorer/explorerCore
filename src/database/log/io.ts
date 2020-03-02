import localIO from "./io/localIo";


export function write(codec, obj, options) {
    return localIO.write(codec, obj, options)
}
export function read(cid, options) {
    return localIO.read(cid, options)
}
