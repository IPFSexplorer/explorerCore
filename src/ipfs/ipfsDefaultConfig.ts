import Protector from "libp2p-pnet";
import cbor from "ipld-dag-cbor";
import dagPB from "ipld-dag-pb";
import dagJson from "@ipld/dag-json";
import getPort from "get-port";
import multicodec from "multicodec";
import { Guid } from "guid-typescript";

export async function randomPortsConfigAsync() {
    return {
        repo: "feeder",
        config: {
            Addresses: {
                Swarm: [
                    "/ip4/0.0.0.0/tcp/" + (await getPort()),
                    "/ip4/127.0.0.1/tcp/9878/ws",
                    "/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star",
                    "/dns4/xxx/tcp/127.0.0.1/ws/p2p-webrtc-star",
                ],
                API: "/ip4/127.0.0.1/tcp/" + (await getPort()),
                Gateway: "/ip4/127.0.0.1/tcp/" + (await getPort()),
            },
        },
        ipld: {
            formats: [cbor, dagPB, require("@ipld/dag-json")],
        },
        libp2p: {
            modules: {
                connProtector: new Protector(`/key/swarm/psk/1.0.0/
/base16/
30734f1804abb36a803d0e9f1a31ffe5851b6df1445bf23f96fd3fe8fbc9e793`),
            },
            config: {
                peerDiscovery: {
                    autoDial: true,
                    webRTCStar: {
                        enabled: true,
                    },
                },
                pubsub: {
                    emitSelf: false,
                },
            },
        },
    };
}

export function browserConfigAsync() {
    return {
        pass: "01234567890123456789",
        preload: { enabled: false },
        config: {
            Addresses: {
                Swarm: [
                    // This is a public webrtc-star server
                    // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star'
                    "/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star",
                ],
            },
        },
        ipld: {
            formats: [cbor, require("ipld-dag-pb")],
        },
        libp2p: {
            modules: {
                connProtector: new Protector(`/key/swarm/psk/1.0.0/
/base16/
30734f1804abb36a803d0e9f1a31ffe5851b6df1445bf23f96fd3fe8fbc9e793`),
            },
            config: {
                peerDiscovery: {
                    autoDial: true,
                    webRTCStar: {
                        enabled: true,
                    },
                },
                pubsub: {
                    emitSelf: false,
                },
            },
        },
    };
}
