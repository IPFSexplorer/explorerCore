export default {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    hash: "00000000b2cde2159116889837ecf300bd77d229d49b138c55366b54626e495d",
    previousBlockHash:
        "000000008b3ff2aaf3427f2a624cb9978e687d9fbba5000dc2f52bb4cc82d4be",
    nextBlockHash:
        "000000009a940db389f3a7cbb8405f4ec14342bed36073b60ee63ed7e117f193",
    height: 187,
    confirmations: 611728,
    size: 414,
    time: 1231744600,
    version: 1,
    merkleRoot:
        "52478db532c594119845eb8260d640d78798e4b7fcb77fed4e2bad4c3ecbaf1c",
    nonce: "853721115",
    bits: "1d00ffff",
    difficulty: "1",
    txCount: 2,
    txs: [
        {
            txid:
                "70587f1780ccd2ebbace28a7b33d83d19f4362f10ff7a4ad88f8c413883f94b7",
            vin: [{ n: 0, isAddress: false, value: "0" }],
            vout: [
                {
                    value: "5000000000",
                    n: 0,
                    addresses: ["1FDMwEo8qNa9icVcooBUoGvA6NriePtJJ3"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000b2cde2159116889837ecf300bd77d229d49b138c55366b54626e495d",
            blockHeight: 187,
            confirmations: 611728,
            blockTime: 1231744600,
            value: "5000000000",
            valueIn: "0",
            fees: "0"
        },
        {
            txid:
                "4385fcf8b14497d0659adccfe06ae7e38e0b5dc95ff8a13d7c62035994a0cd79",
            vin: [
                {
                    n: 0,
                    addresses: ["13HtsYzne8xVPdGDnmJX8gHgBZerAfJGEf"],
                    isAddress: true,
                    value: "100000000"
                }
            ],
            vout: [
                {
                    value: "100000000",
                    n: 0,
                    spent: true,
                    spentTxId:
                        "a3b0e9e7cddbbe78270fa4182a7675ff00b92872d8df7d14265a2b1e379a9d33",
                    spentIndex: 1,
                    spentHeight: 496,
                    addresses: ["15NUwyBYrZcnUgTagsm1A7M2yL2GntpuaZ"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000b2cde2159116889837ecf300bd77d229d49b138c55366b54626e495d",
            blockHeight: 187,
            confirmations: 611728,
            blockTime: 1231744600,
            value: "100000000",
            valueIn: "100000000",
            fees: "0"
        }
    ]
};
