export default {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    hash: "00000000309014d78fc7440362c8ae0599e79557fe7bd0c94172dbc8c050ba5e",
    previousBlockHash:
        "000000003c22a2357ddc3c55c098346c9ee68510984b2c41c351c548ef295162",
    nextBlockHash:
        "00000000015402dc2bcc4afdc3be3c58e873a7ecea22c12f72d6889eb9b9a0b1",
    height: 524,
    confirmations: 611392,
    size: 491,
    time: 1231983986,
    version: 1,
    merkleRoot:
        "113a8813ba5675f6665ba0e4c2d3dee743979a11ae5866321cf90e31fec2d720",
    nonce: "826316549",
    bits: "1d00ffff",
    difficulty: "1",
    txCount: 2,
    txs: [
        {
            txid:
                "52c81ac33227ec10664ba42b9869fcbb2ba74310e7df9ea972780ac04357d029",
            vin: [{ n: 0, isAddress: false, value: "0" }],
            vout: [
                {
                    value: "5000000000",
                    n: 0,
                    addresses: ["1EZ32tKEP5WaNTDWX94ZLfke6H7BjUuYXk"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000309014d78fc7440362c8ae0599e79557fe7bd0c94172dbc8c050ba5e",
            blockHeight: 524,
            confirmations: 611392,
            blockTime: 1231983986,
            value: "5000000000",
            valueIn: "0",
            fees: "0"
        },
        {
            txid:
                "d71fd2f64c0b34465b7518d240c00e83f6a5b10138a7079d1252858fe7e6b577",
            vin: [
                {
                    n: 0,
                    addresses: ["1Jhk2DHosaaZx1E4CbnTGcKM7FC88YHYv9"],
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
                        "35288d269cee1941eaebb2ea85e32b42cdb2b04284a56d8b14dcc3f5c65d6055",
                    spentHeight: 545,
                    addresses: ["1DCbY2GYVaAMCBpuBNN5GVg3a47pNK1wdi"],
                    isAddress: true
                },
                {
                    value: "2500000000",
                    n: 1,
                    addresses: ["1Jhk2DHosaaZx1E4CbnTGcKM7FC88YHYv9"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000309014d78fc7440362c8ae0599e79557fe7bd0c94172dbc8c050ba5e",
            blockHeight: 524,
            confirmations: 611392,
            blockTime: 1231983986,
            value: "5000000000",
            valueIn: "5000000000",
            fees: "0"
        }
    ]
};
