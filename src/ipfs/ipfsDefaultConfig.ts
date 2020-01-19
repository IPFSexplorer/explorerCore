import os from "os";
import fs from "fs";
import path from "path";
import Protector from "libp2p-pnet";
import Libp2p from "libp2p";
import TCP from "libp2p-tcp";
import MulticastDNS from "libp2p-mdns";
import WebSocketStar from "libp2p-websocket-star";
import Bootstrap from "libp2p-bootstrap";
import SPDY from "libp2p-spdy";
import KadDHT from "libp2p-kad-dht";
import MPLEX from "pull-mplex";
import SECIO from "libp2p-secio";
import cbor from "ipld-dag-cbor";

const swarmKeyPath = path.resolve(__dirname, "../swarm.key");

/**
 * This is the bundle we will use to create our fully customized libp2p bundle.
 *
 * @param {libp2pBundle~options} opts The options to use when generating the libp2p node
 * @returns {Libp2p} Our new libp2p node
 */
const libp2pBundle = opts => {
    // Set convenience variables to clearly showcase some of the useful things that are available
    const peerInfo = opts.peerInfo;
    const peerBook = opts.peerBook;
    const bootstrapList = opts.config.Bootstrap;

    // Create our WebSocketStar transport and give it our PeerId, straight from the ipfs node
    const wsstar = new WebSocketStar({
        id: peerInfo.id
    });

    // Build and return our libp2p node
    return new Libp2p({
        peerInfo,
        peerBook,
        // Lets limit the connection managers peers and have it check peer health less frequently
        connectionManager: {
            minPeers: 25,
            maxPeers: 100,
            pollInterval: 5000
        },
        modules: {
            connProtector: new Protector(fs.readFileSync(swarmKeyPath)),
            transport: [TCP, wsstar],
            streamMuxer: [MPLEX, SPDY],
            connEncryption: [SECIO],
            peerDiscovery: [MulticastDNS, Bootstrap, wsstar.discovery],
            dht: KadDHT
        },
        config: {
            peerDiscovery: {
                autoDial: true, // auto dial to peers we find when we have less peers than `connectionManager.minPeers`
                mdns: {
                    interval: 10000,
                    enabled: true
                },
                bootstrap: {
                    interval: 30e3,
                    enabled: true,
                    list: bootstrapList
                }
            },
            // Turn on relay with hop active so we can connect to more peers
            relay: {
                enabled: true,
                hop: {
                    enabled: true,
                    active: true
                }
            },
            dht: {
                enabled: true,
                kBucketSize: 20,
                randomWalk: {
                    enabled: true,
                    interval: 10e3, // This is set low intentionally, so more peers are discovered quickly. Higher intervals are recommended
                    timeout: 2e3 // End the query quickly since we're running so frequently
                }
            },
            pubsub: {
                enabled: true
            }
        }
    });
};

export default {
    repo: os.homedir() + "/.ipfs",
    pass: "01234567890123456789",
    preload: { enabled: false },
    config: {
        Addresses: {
            Swarm: [
                "/ip4/0.0.0.0/tcp/4012",
                "/ip4/127.0.0.1/tcp/4013/ws",
                "/dns4/xxx/tcp/9090/ws/p2p-webrtc-star"
            ],
            API: "/ip4/127.0.0.1/tcp/5012",
            Gateway: "/ip4/127.0.0.1/tcp/9191"
        }
    },
    ipld: {
        formats: [cbor, require("ipld-dag-pb")]
    },
    connectionManager: {
        minPeers: 1,
        maxPeers: 50
    },
    libp2p: libp2pBundle
};
