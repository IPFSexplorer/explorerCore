export default {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    hash: "0000000054487811fc4ff7a95be738aa5ad9320c394c482b27c0da28b227ad5d",
    previousBlockHash:
        "00000000dc55860c8a29c58d45209318fa9e9dc2c1833a7226d86bc465afc6e5",
    nextBlockHash:
        "00000000f46e513f038baf6f2d9a95b2a28d8a6c985bcf24b9e07f0f63a29888",
    height: 182,
    confirmations: 611733,
    size: 490,
    time: 1231740736,
    version: 1,
    merkleRoot:
        "2f0f017f1991a1393798ff851bfc02ce7ba3f5e066815ed3104afb4bd3a0c230",
    nonce: "2662131500",
    bits: "1d00ffff",
    difficulty: "1",
    txCount: 2,
    txs: [
        {
            txid:
                "09e5c4a5a089928bbe368cd0f2b09abafb3ebf328cd0d262d06ec35bdda1077f",
            vin: [{ n: 0, isAddress: false, value: "0" }],
            vout: [
                {
                    value: "5000000000",
                    n: 0,
                    addresses: ["1Fr947YZyEWZd2JPcvDJbsYN6Po5gXRyau"],
                    isAddress: true
                }
            ],
            blockHash:
                "0000000054487811fc4ff7a95be738aa5ad9320c394c482b27c0da28b227ad5d",
            blockHeight: 182,
            confirmations: 611733,
            blockTime: 1231740736,
            value: "5000000000",
            valueIn: "0",
            fees: "0"
        },
        {
            txid:
                "591e91f809d716912ca1d4a9295e70c3e78bab077683f79350f101da64588073",
            vin: [
                {
                    n: 0,
                    addresses: ["12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S"],
                    isAddress: true,
                    value: "3000000000"
                }
            ],
            vout: [
                {
                    value: "100000000",
                    n: 0,
                    spent: true,
                    spentTxId:
                        "298ca2045d174f8a158961806ffc4ef96fad02d71a6b84d9fa0491813a776160",
                    spentHeight: 221,
                    addresses: ["1LzBzVqEeuQyjD2mRWHes3dgWrT9titxvq"],
                    isAddress: true
                },
                {
                    value: "2900000000",
                    n: 1,
                    spent: true,
                    spentTxId:
                        "12b5633bad1f9c167d523ad1aa1947b2732a865bf5414eab2f9e5ae5d5c191ba",
                    spentHeight: 183,
                    addresses: ["12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S"],
                    isAddress: true
                }
            ],
            blockHash:
                "0000000054487811fc4ff7a95be738aa5ad9320c394c482b27c0da28b227ad5d",
            blockHeight: 182,
            confirmations: 611733,
            blockTime: 1231740736,
            value: "3000000000",
            valueIn: "3000000000",
            fees: "0"
        }
    ]
};
