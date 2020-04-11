import ipfsIO from "./io/ipfsIO";

export async function write(codec, obj, options = {}) {
    return await ipfsIO.write(codec, obj, options);
}
export async function read(cid, options) {
    return await ipfsIO.read(cid, options);
}
