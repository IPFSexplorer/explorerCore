import CID from 'cids';
import dagPB from 'ipld-dag-pb';
import DAG from "../../../ipfs/DAG";
import PIN from "../../../ipfs/PIN";
import io from "./IOinterface";
const defaultBase = 'base58btc';

export default class ipfsIO implements io
{

    private static cidifyString(str)
    {
        if (!str)
        {
            return str;
        }

        if (Array.isArray(str))
        {
            return str.map(ipfsIO.cidifyString);
        }

        return new CID(str);
    }

    private static stringifyCid(cid, options)
    {
        if (!cid || typeof cid === 'string')
        {
            return cid;
        }

        if (Array.isArray(cid))
        {
            return cid.map(ipfsIO.stringifyCid);
        }

        if (cid['/'])
        {
            return cid['/'];
        }

        const base = options.base || defaultBase;
        return cid.toBaseEncodedString(base);
    }

    private static async writePb(obj, options)
    {
        const buffer = Buffer.from(JSON.stringify(obj));
        const dagNode = new dagPB.DAGNode(buffer);
        const cid = await DAG.PutAsync(dagNode, {
            format: 'dag-pb',
            hashAlg: 'sha2-256'
        });

        const res = cid.toV0().toBaseEncodedString();
        const pin = options.pin || false;
        if (pin)
        {
            await PIN.AddAsync(res);
        }

        return res;
    }

    private static async readPb(cid)
    {
        const result = await DAG.GetAsync(cid);
        const dagNode = result;

        return JSON.parse(dagNode.toJSON().data);
    }

    private static async writeJson(obj, options)
    {
        const cid = await DAG.PutAsync(obj);

        const res = cid.toString();
        const pin = options.pin || false;
        if (pin)
        {
            await PIN.AddAsync(res);
        }

        return cid;
    }

    private static async readJson(cid)
    {
        const result = await DAG.GetAsync(cid);
        const dagNode = result;

        return dagNode;
    }

    private static async writeCbor(obj, options)
    {
        const dagNode = Object.assign({}, obj);
        const links = options.links || [];
        links.forEach((prop) =>
        {
            if (dagNode[prop])
            {
                dagNode[prop] = ipfsIO.cidifyString(dagNode[prop]);
            }
        });

        const base = options.base || defaultBase;
        const onlyHash = options.onlyHash || false;
        const cid = await DAG.PutAsync(dagNode, { onlyHash });
        const res = cid.toBaseEncodedString(base);
        const pin = options.pin || false;
        if (pin)
        {
            await PIN.AddAsync(res);
        }
        return res;
    }

    private static async readCbor(cid, options)
    {
        const result = await DAG.GetAsync(cid);
        const obj = result;
        const links = options.links || [];
        links.forEach((prop) =>
        {
            if (obj[prop])
            {
                obj[prop] = ipfsIO.stringifyCid(obj[prop], options);
            }
        });

        return obj;
    }

    private static async writeObj(obj, options)
    {
        const onlyHash = options.onlyHash || false;
        const base = options.base || defaultBase;
        const opts = Object.assign({}, { onlyHash: onlyHash }, options.format ? { format: options.format, hashAlg: 'sha2-256' } : {});
        if (opts.format === 'dag-pb')
        {
            obj = new dagPB.DAGNode(obj);
        }

        const cid = await DAG.PutAsync(obj, opts);
        const res = cid.toBaseEncodedString(base);
        const pin = options.pin || false;
        if (pin)
        {
            await PIN.AddAsync(res);
        }
        return res;
    }

    private static formats = {
        'dag-pb': { read: ipfsIO.readPb, write: ipfsIO.writePb },
        'dag-cbor': { write: ipfsIO.writeCbor, read: ipfsIO.readCbor },
        'dag-json': { write: ipfsIO.writeJson, read: ipfsIO.readJson },
        'raw': { write: ipfsIO.writeObj }
    };

    public static async write(codec, obj, options = {})
    {
        const format = ipfsIO.formats[codec];
        if (!format) throw new Error('Unsupported codec');

        return await format.write(obj, options);
    }

    public static async read(cid, options = {})
    {
        cid = new CID(cid);
        const format = ipfsIO.formats[cid.codec];

        if (!format) throw new Error('Unsupported codec');

        return await format.read(cid, options);
    }
} 
