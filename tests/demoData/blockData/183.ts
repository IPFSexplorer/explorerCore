export default {
    page: 1,
    totalPages: 1,
    itemsOnPage: 1000,
    hash: "00000000f46e513f038baf6f2d9a95b2a28d8a6c985bcf24b9e07f0f63a29888",
    previousBlockHash:
        "0000000054487811fc4ff7a95be738aa5ad9320c394c482b27c0da28b227ad5d",
    nextBlockHash:
        "00000000ff862f4e3c760fee9666defe2ac0ff026171953558b14421840a2446",
    height: 183,
    confirmations: 611732,
    size: 491,
    time: 1231742062,
    version: 1,
    merkleRoot:
        "df25983b51d84d40b4efcb5556cdd6d524ac2d21bca49037494e413ae0712529",
    nonce: "3235118355",
    bits: "1d00ffff",
    difficulty: "1",
    txCount: 2,
    txs: [
        {
            txid:
                "b2e561eb278f5aba7a2c78d46422f496f4998003635cc65807e230407190a355",
            vin: [{ n: 0, isAddress: false, value: "0" }],
            vout: [
                {
                    value: "5000000000",
                    n: 0,
                    addresses: ["1642o19pahkkdwHuPSx6uxk9HMmC243Bu7"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000f46e513f038baf6f2d9a95b2a28d8a6c985bcf24b9e07f0f63a29888",
            blockHeight: 183,
            confirmations: 611732,
            blockTime: 1231742062,
            value: "5000000000",
            valueIn: "0",
            fees: "0"
        },
        {
            txid:
                "12b5633bad1f9c167d523ad1aa1947b2732a865bf5414eab2f9e5ae5d5c191ba",
            vin: [
                {
                    n: 0,
                    addresses: ["12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S"],
                    isAddress: true,
                    value: "2900000000"
                }
            ],
            vout: [
                {
                    value: "100000000",
                    n: 0,
                    spent: true,
                    spentTxId:
                        "4385fcf8b14497d0659adccfe06ae7e38e0b5dc95ff8a13d7c62035994a0cd79",
                    spentHeight: 187,
                    addresses: ["13HtsYzne8xVPdGDnmJX8gHgBZerAfJGEf"],
                    isAddress: true
                },
                {
                    value: "2800000000",
                    n: 1,
                    spent: true,
                    spentTxId:
                        "828ef3b079f9c23829c56fe86e85b4a69d9e06e5b54ea597eef5fb3ffef509fe",
                    spentHeight: 248,
                    addresses: ["12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S"],
                    isAddress: true
                }
            ],
            blockHash:
                "00000000f46e513f038baf6f2d9a95b2a28d8a6c985bcf24b9e07f0f63a29888",
            blockHeight: 183,
            confirmations: 611732,
            blockTime: 1231742062,
            value: "2900000000",
            valueIn: "2900000000",
            fees: "0"
        }
    ]
};
