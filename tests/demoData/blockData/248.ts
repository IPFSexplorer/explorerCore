export default {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    hash: "00000000fb5b44edc7a1aa105075564a179d65506e2bd25f55f1629251d0f6b0",
    previousBlockHash:
        "000000005fae7d3d06fc898ccdc1d9435b917dd2db63ecf0a0bc2b3f4210b831",
    nextBlockHash:
        "000000001a483a866ad69445e03a31db4ed5a9ea3f1cfec388fc18092f242155",
    height: 248,
    confirmations: 611667,
    size: 492,
    time: 1231790660,
    version: 1,
    merkleRoot:
        "ae64c2dea1d5ccd2a156dc0cb0c6ac66d9726d573d63962df61412145232c100",
    nonce: "3552595225",
    bits: "1d00ffff",
    difficulty: "1",
    txCount: 2,
    txs: [
        {
            txid:
                "cf7bddc54f693c94a852a93e80ce971358d47b478929772b60cd84a41e0b3451",
            vin: [{ n: 0, isAddress: false, value: "0" }],
            vout: [
                {
                    value: "5000000000",
                    n: 0,
                    addresses: ["16NEqTQenDpSAn18utw6sYD631Cq9znZf7"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000fb5b44edc7a1aa105075564a179d65506e2bd25f55f1629251d0f6b0",
            blockHeight: 248,
            confirmations: 611667,
            blockTime: 1231790660,
            value: "5000000000",
            valueIn: "0",
            fees: "0"
        },
        {
            txid:
                "828ef3b079f9c23829c56fe86e85b4a69d9e06e5b54ea597eef5fb3ffef509fe",
            vin: [
                {
                    n: 0,
                    addresses: ["12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S"],
                    isAddress: true,
                    value: "2800000000"
                }
            ],
            vout: [
                {
                    value: "1000000000",
                    n: 0,
                    spent: true,
                    spentTxId:
                        "a3b0e9e7cddbbe78270fa4182a7675ff00b92872d8df7d14265a2b1e379a9d33",
                    spentIndex: 2,
                    spentHeight: 496,
                    addresses: ["1ByLSV2gLRcuqUmfdYcpPQH8Npm8cccsFg"],
                    isAddress: true
                },
                {
                    value: "1800000000",
                    n: 1,
                    addresses: ["12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000fb5b44edc7a1aa105075564a179d65506e2bd25f55f1629251d0f6b0",
            blockHeight: 248,
            confirmations: 611667,
            blockTime: 1231790660,
            value: "2800000000",
            valueIn: "2800000000",
            fees: "0"
        }
    ]
};
