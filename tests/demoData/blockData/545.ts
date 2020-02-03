export default {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    hash: "00000000689051c09ff2cd091cc4c22c10b965eb8db3ad5f032621cc36626175",
    previousBlockHash:
        "000000002d947997dc957cdf075dd32390f5f754d2656208d5dd82a6620179f5",
    nextBlockHash:
        "000000005a4ded781e667e06ceefafb71410b511fe0d5adc3e5a27ecbec34ae6",
    height: 545,
    confirmations: 611371,
    size: 493,
    time: 1231998512,
    version: 1,
    merkleRoot:
        "1aa5781b7674714f9557c1c272071dd2ed328e06a1b2529d260780b7d8283019",
    nonce: "1211379258",
    bits: "1d00ffff",
    difficulty: "1",
    txCount: 2,
    txs: [
        {
            txid:
                "c3dbd09da393e0f511c20d40bb61250f6f1e6415b80b294c0f8e3aa4c6e798db",
            vin: [{ n: 0, isAddress: false, value: "0" }],
            vout: [
                {
                    value: "5000000000",
                    n: 0,
                    addresses: ["15kKY1Tx3e5Qt52ZeZVm1bZKzrMRD11tGc"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000689051c09ff2cd091cc4c22c10b965eb8db3ad5f032621cc36626175",
            blockHeight: 545,
            confirmations: 611371,
            blockTime: 1231998512,
            value: "5000000000",
            valueIn: "0",
            fees: "0"
        },
        {
            txid:
                "35288d269cee1941eaebb2ea85e32b42cdb2b04284a56d8b14dcc3f5c65d6055",
            vin: [
                {
                    n: 0,
                    addresses: ["1DCbY2GYVaAMCBpuBNN5GVg3a47pNK1wdi"],
                    isAddress: true,
                    value: "2500000000"
                }
            ],
            vout: [
                {
                    value: "100000000",
                    n: 0,
                    spent: true,
                    spentTxId:
                        "28204cad1d7fc1d199e8ef4fa22f182de6258a3eaafe1bbe56ebdcacd3069a5f",
                    spentHeight: 546,
                    addresses: ["1DZTzaBHUDM7T3QvUKBz4qXMRpkg8jsfB5"],
                    isAddress: true
                },
                {
                    value: "2400000000",
                    n: 1,
                    spent: true,
                    spentTxId:
                        "28204cad1d7fc1d199e8ef4fa22f182de6258a3eaafe1bbe56ebdcacd3069a5f",
                    spentIndex: 1,
                    spentHeight: 546,
                    addresses: ["1DCbY2GYVaAMCBpuBNN5GVg3a47pNK1wdi"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000689051c09ff2cd091cc4c22c10b965eb8db3ad5f032621cc36626175",
            blockHeight: 545,
            confirmations: 611371,
            blockTime: 1231998512,
            value: "2500000000",
            valueIn: "2500000000",
            fees: "0"
        }
    ]
};
