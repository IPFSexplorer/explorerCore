export default {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    hash: "000000001d6a5eaa63b653d569e87179366ffee019ea4108f766e79578b5ebb2",
    previousBlockHash:
        "000000007ba4ed8233fba72ad14360d0aa1bd8ef5675c2d06659dfabd5862084",
    nextBlockHash:
        "00000000a3fb5d9b782814d661a6927d42e5e2c48a445d20d625bce577178f9a",
    height: 593,
    confirmations: 611323,
    size: 492,
    time: 1232034716,
    version: 1,
    merkleRoot:
        "952ddfa93b195f31a0c1a1114bf8e6d66ee861ae7f0e93e0593ba68fb6c10359",
    nonce: "2441341989",
    bits: "1d00ffff",
    difficulty: "1",
    txCount: 2,
    txs: [
        {
            txid:
                "8b3e3337952cbd2dac159723c972954efb02c05b9c583a081a1e11ed8e861ae4",
            vin: [{ n: 0, isAddress: false, value: "0" }],
            vout: [
                {
                    value: "5000000000",
                    n: 0,
                    addresses: ["1PSPvNhG2pTjN15x2DzZZWs2UG53AVNdQi"],
                    isAddress: true
                }
            ],
            blockHash:
                "000000001d6a5eaa63b653d569e87179366ffee019ea4108f766e79578b5ebb2",
            blockHeight: 593,
            confirmations: 611323,
            blockTime: 1232034716,
            value: "5000000000",
            valueIn: "0",
            fees: "0"
        },
        {
            txid:
                "e36f06a8dfe44c3d64be2d3fe56c77f91f6a39da4a5ffc086ecb5db9664e8583",
            vin: [
                {
                    n: 0,
                    addresses: ["153h6eE6xRhXuN3pE53gWVfXacAtfyBF8g"],
                    isAddress: true,
                    value: "5000000000"
                }
            ],
            vout: [
                {
                    value: "2500000000",
                    n: 0,
                    spent: true,
                    spentTxId:
                        "247106afbe9c52c743b20c5604b1e3f2293d66da9ddeb038a46f10ad8ccbd53e",
                    spentHeight: 128845,
                    addresses: ["1LEWwJkDj8xriE87ALzQYcHjTmD8aqDj1f"],
                    isAddress: true
                },
                {
                    value: "2500000000",
                    n: 1,
                    spent: true,
                    spentTxId:
                        "90ff15e5a80593977fb2f6666de2860584d39ebc3a41f65a0a1fdc3a851aefda",
                    spentIndex: 2,
                    spentHeight: 1056,
                    addresses: ["153h6eE6xRhXuN3pE53gWVfXacAtfyBF8g"],
                    isAddress: true
                }
            ],
            blockHash:
                "000000001d6a5eaa63b653d569e87179366ffee019ea4108f766e79578b5ebb2",
            blockHeight: 593,
            confirmations: 611323,
            blockTime: 1232034716,
            value: "5000000000",
            valueIn: "5000000000",
            fees: "0"
        }
    ]
};
