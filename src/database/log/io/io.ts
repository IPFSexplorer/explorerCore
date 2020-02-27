import CID from 'cids'
import dagPB from 'ipld-dag-pb'
import DAG from "../../../ipfs/DAG"
import PIN from "../../../ipfs/PIN"
const defaultBase = 'base58btc'

const cidifyString = (str) => {
    if (!str) {
        return str
    }

    if (Array.isArray(str)) {
        return str.map(cidifyString)
    }

    return new CID(str)
}

const stringifyCid = (cid, options) => {
    if (!cid || typeof cid === 'string') {
        return cid
    }

    if (Array.isArray(cid)) {
        return cid.map(stringifyCid)
    }

    if (cid['/']) {
        return cid['/']
    }

    const base = options.base || defaultBase
    return cid.toBaseEncodedString(base)
}

const writePb = async (obj, options) => {
    const buffer = Buffer.from(JSON.stringify(obj))
    const dagNode = new dagPB.DAGNode(buffer)
    const cid = await DAG.PutAsync(dagNode, {
        format: 'dag-pb',
        hashAlg: 'sha2-256'
    })

    const res = cid.toV0().toBaseEncodedString()
    const pin = options.pin || false
    if (pin) {
        await PIN.AddAsync(res)
    }

    return res
}

const readPb = async (cid) => {
    const result = await DAG.GetAsync(cid)
    const dagNode = result.value

    return JSON.parse(dagNode.toJSON().data)
}

const writeCbor = async (obj, options) => {
    const dagNode = Object.assign({}, obj)
    const links = options.links || []
    links.forEach((prop) => {
        if (dagNode[prop]) {
            dagNode[prop] = cidifyString(dagNode[prop])
        }
    })

    const base = options.base || defaultBase
    const onlyHash = options.onlyHash || false
    const cid = await DAG.PutAsync(dagNode, { onlyHash })
    const res = cid.toBaseEncodedString(base)
    const pin = options.pin || false
    if (pin) {
        await PIN.AddAsync(res)
    }
    return res
}

const readCbor = async (cid, options) => {
    const result = await DAG.GetAsync(cid)
    const obj = result.value
    const links = options.links || []
    links.forEach((prop) => {
        if (obj[prop]) {
            obj[prop] = stringifyCid(obj[prop], options)
        }
    })

    return obj
}

const writeObj = async (obj, options) => {
    const onlyHash = options.onlyHash || false
    const base = options.base || defaultBase
    const opts = Object.assign({}, { onlyHash: onlyHash }, options.format ? { format: options.format, hashAlg: 'sha2-256' } : {})
    if (opts.format === 'dag-pb') {
        obj = new dagPB.DAGNode(obj)
    }

    const cid = await DAG.PutAsync(obj, opts)
    const res = cid.toBaseEncodedString(base)
    const pin = options.pin || false
    if (pin) {
        await PIN.AddAsync(res)
    }
    return res
}

const formats = {
    'dag-pb': { read: readPb, write: writePb },
    'dag-cbor': { write: writeCbor, read: readCbor },
    'raw': { write: writeObj }
}

export const write = (codec, obj, options = {}) => {
    const format = formats[codec]
    if (!format) throw new Error('Unsupported codec')

    return format.write(obj, options)
}

export const read = (cid, options = {}) => {
    cid = new CID(cid)
    const format = formats[cid.codec]

    if (!format) throw new Error('Unsupported codec')

    return format.read(cid, options)
}

