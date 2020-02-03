export default {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    hash: "00000000d1145790a8694403d4063f323d499e655c83426834d4ce2f8dd4a2ee",
    previousBlockHash:
        "000000002a22cfee1f2c846adbd12b3e183d4f97683f85dad08a79780a84bd55",
    nextBlockHash:
        "00000000c9ec538cab7f38ef9c67a95742f56ab07b0a37c5be6b02808dbfb4e0",
    height: 170,
    confirmations: 611745,
    size: 490,
    time: 1231731025,
    version: 1,
    merkleRoot:
        "7dac2c5666815c17a3b36427de37bb9d2e2c5ccec3f8633eb91a4205cb4c10ff",
    nonce: "1889418792",
    bits: "1d00ffff",
    difficulty: "1",
    txCount: 2,
    txs: [
        {
            txid:
                "b1fea52486ce0c62bb442b530a3f0132b826c74e473d1f2c220bfa78111c5082",
            vin: [{ n: 0, isAddress: false, value: "0" }],
            vout: [
                {
                    value: "5000000000",
                    n: 0,
                    addresses: ["1PSSGeFHDnKNxiEyFrD1wcEaHr9hrQDDWc"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000d1145790a8694403d4063f323d499e655c83426834d4ce2f8dd4a2ee",
            blockHeight: 170,
            confirmations: 611745,
            blockTime: 1231731025,
            value: "5000000000",
            valueIn: "0",
            fees: "0"
        },
        {
            txid:
                "f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16",
            vin: [
                {
                    n: 0,
                    addresses: ["12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S"],
                    isAddress: true,
                    value: "5000000000"
                }
            ],
            vout: [
                {
                    value: "1000000000",
                    n: 0,
                    spent: true,
                    spentTxId:
                        "ea44e97271691990157559d0bdd9959e02790c34db6c006d779e82fa5aee708e",
                    spentHeight: 92240,
                    addresses: ["1Q2TWHE3GMdB6BZKafqwxXtWAWgFt5Jvm3"],
                    isAddress: true
                },
                {
                    value: "4000000000",
                    n: 1,
                    spent: true,
                    spentTxId:
                        "a16f3ce4dd5deb92d98ef5cf8afeaf0775ebca408f708b2146c4fb42b41e14be",
                    spentHeight: 181,
                    addresses: ["12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000d1145790a8694403d4063f323d499e655c83426834d4ce2f8dd4a2ee",
            blockHeight: 170,
            confirmations: 611745,
            blockTime: 1231731025,
            value: "5000000000",
            valueIn: "5000000000",
            fees: "0"
        }
    ]
};
