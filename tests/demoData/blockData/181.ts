export default {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    hash: "00000000dc55860c8a29c58d45209318fa9e9dc2c1833a7226d86bc465afc6e5",
    previousBlockHash:
        "00000000b5ef0ea215becad97402ce59d1416fe554261405cda943afd2a8c8f2",
    nextBlockHash:
        "0000000054487811fc4ff7a95be738aa5ad9320c394c482b27c0da28b227ad5d",
    height: 181,
    confirmations: 611734,
    size: 490,
    time: 1231740133,
    version: 1,
    merkleRoot:
        "ed92b1db0b3e998c0a4351ee3f825fd5ac6571ce50c050b4b45df015092a6c36",
    nonce: "792669465",
    bits: "1d00ffff",
    difficulty: "1",
    txCount: 2,
    txs: [
        {
            txid:
                "8347cee4a1cb5ad1bb0d92e86e6612dbf6cfc7649c9964f210d4069b426e720a",
            vin: [{ n: 0, isAddress: false, value: "0" }],
            vout: [
                {
                    value: "5000000000",
                    n: 0,
                    addresses: ["1JSW4QekxPokWWU4hcRwrheZbZKSkFz9oc"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000dc55860c8a29c58d45209318fa9e9dc2c1833a7226d86bc465afc6e5",
            blockHeight: 181,
            confirmations: 611734,
            blockTime: 1231740133,
            value: "5000000000",
            valueIn: "0",
            fees: "0"
        },
        {
            txid:
                "a16f3ce4dd5deb92d98ef5cf8afeaf0775ebca408f708b2146c4fb42b41e14be",
            vin: [
                {
                    n: 0,
                    addresses: ["12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S"],
                    isAddress: true,
                    value: "4000000000"
                }
            ],
            vout: [
                {
                    value: "1000000000",
                    n: 0,
                    addresses: ["1DUDsfc23Dv9sPMEk5RsrtfzCw5ofi5sVW"],
                    isAddress: true
                },
                {
                    value: "3000000000",
                    n: 1,
                    spent: true,
                    spentTxId:
                        "591e91f809d716912ca1d4a9295e70c3e78bab077683f79350f101da64588073",
                    spentHeight: 182,
                    addresses: ["12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000dc55860c8a29c58d45209318fa9e9dc2c1833a7226d86bc465afc6e5",
            blockHeight: 181,
            confirmations: 611734,
            blockTime: 1231740133,
            value: "4000000000",
            valueIn: "4000000000",
            fees: "0"
        }
    ]
};
