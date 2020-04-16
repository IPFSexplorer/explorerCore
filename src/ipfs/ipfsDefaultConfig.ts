import Protector from "libp2p-pnet";

export async function randomPortsConfigAsync() {
    return {
        repo: "feeder",

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
        libp2p: {
            modules: {
                connProtector: new Protector(`/key/swarm/psk/1.0.0/
/base16/
30734f1804abb36a803d0e9f1a31ffe5851b6df1445bf23f96fd3fe8fbc9e793`),
            },
        },
    };
}
