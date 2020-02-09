import Protector from "libp2p-pnet";
import cbor from "ipld-dag-cbor";
import getPort from "get-port";

export async function randomPortsConfigAsync() {
    return {
        config: {
            Addresses: {
                Swarm: [
                    "/ip4/0.0.0.0/tcp/" + (await getPort()),
                    "/ip4/127.0.0.1/tcp/" + (await getPort()) + "/ws",
                    "/dns4/xxx/tcp/9090/ws/p2p-webrtc-star"
                ],
                API: "/ip4/127.0.0.1/tcp/" + (await getPort()),
                Gateway: "/ip4/127.0.0.1/tcp/" + (await getPort())
            }
        }
    };
}

export async function browserConfigAsync() {
    return {
        repo: "ipfs-" + Math.random(),
        pass: "01234567890123456789",
        preload: { enabled: false },
        config: {
            Addresses: {
                Swarm: [
                    // This is a public webrtc-star server
                    // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star'
                    "/ip4/127.0.0.1/tcp/9090/wss/p2p-webrtc-star"
                ]
            }
        },
        ipld: {
            formats: [cbor, require("ipld-dag-pb")]
        },
        libp2p: {
            modules: {
                connProtector: new Protector(`/key/swarm/psk/1.0.0/
/base16/
30734f1804abb36a803d0e9f1a31ffe5851b6df1445bf23f96fd3fe8fbc9e793`)
            },
            config: {
                peerDiscovery: {
                    autoDial: true,
                    webRTCStar: {
                        enabled: true
                    }
                }
            }
        }
    };
}
