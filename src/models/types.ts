// Vin contains information about single transaction input
type Vin = {
    txid: string;
    vout: number;
    sequence: number;
    n: number;
    addresses: string[];
    isAddress: boolean;
    value: string;
    hex: string;
    asm: string;
    coinbase: string;
};

// Vout contains information about single transaction output
type Vout = {
    value: string;
    n: number;
    spent: boolean;
    spentTxId: string;
    spentIndex: number;
    spentHeight: number;
    hex: string;
    asm: string;
    addresses: string[];
    isAddress: boolean;
    type: string;
};

// TokenType specifies type of token
enum TokenType {
    ERC20TokenType = "ERC20",
    XPUBAddressTokenType = "XPUBAddress",
}

// Token contains info about tokens held by an address
type Token = {
    type: TokenType;
    name: string;
    path: string;
    contract: string;
    transfers: number;
    symbol: string;
    decimals: number;
    balance: number;
    totalReceived: number;
    totalSent: number;
};

// TokenTransfer contains info about a token transfer done in a transaction
type TokenTransfer = {
    type: TokenType;
    from: string;
    to: string;
    token: string;
    name: string;
    symbol: string;
    decimals: number;
    value: number;
};

// EthereumSpecific contains ethereum specific transaction data
type EthereumSpecific = {
    status: number; // 1 OK, 0 Fail, -1 pending
    nonce: number;
    gasLimit: number;
    gasUsed: number;
    gasPrice: number;
};

// Tx holds information about a transaction
type BlockbookTx = {
    txid: string;
    version: number;
    lockTime: number;
    vin: Vin[];
    vout: Vout[];
    blockHash: string;
    blockHeight: number;
    confirmations: number;
    blockTime: number;
    size: number;
    value: number;
    valueIn: number;
    fees: number;
    hex: string;
    rbf: boolean;
    tokenTransfers: TokenTransfer[];
    ethereumSpecific: EthereumSpecific;
};

// Paging contains information about paging for address, blocks and block
type Paging = {
    page: number;
    totalPages: number;
    itemsOnPage: number;
};

// TokensToReturn specifies what tokens are returned by GetAddress and GetXpubAddress
enum TokensToReturn {
    // AddressFilterVoutOff disables filtering of transactions by vout
    AddressFilterVoutOff = -1,
    // AddressFilterVoutInputs specifies that only txs where the address is as input are returned
    AddressFilterVoutInputs = -2,
    // AddressFilterVoutOutputs specifies that only txs where the address is as output are returned
    AddressFilterVoutOutputs = -3,

    // TokensToReturnNonzeroBalance - return only tokens with nonzero balance
    TokensToReturnNonzeroBalance = 0,
    // TokensToReturnUsed - return tokens with some transfers (even if they have zero balance now)
    TokensToReturnUsed = 1,
    // TokensToReturnDerived - return all derived tokens
    TokensToReturnDerived = 2,
}

// AddressFilter is used to filter data returned from GetAddress api method
type AddressFilter = {
    Vout: number;
    Contract: string;
    FromHeight: number;
    ToHeight: number;
    TokensToReturn: TokensToReturn;
    // OnlyConfirmed set to true will ignore mempool transactions; mempool is also ignored if FromHeight/ToHeight filter is specified
    OnlyConfirmed: boolean;
};

// Erc20Contract contains info about ERC20 contract
type Erc20Contract = {
    Contract: string;
    Name: string;
    Symbol: string;
    Decimals: number;
};

// Address holds information about address and its transactions
interface Address extends Paging {
    Paging;
    address: string;
    balance: number;
    totalReceived: number;
    totalSent: number;
    unconfirmedBalance: number;
    unconfirmedTxs: number;
    txs: number;
    nonTokenTxs: number;
    transactions: BlockbookTx[];
    txids: string[];
    nonce: string;
    usedTokens: number;
    tokens: Token[];
    erc20Contract: Erc20Contract;
}

// Utxo is one unspent transaction output
type Utxo = {
    Txid: string;
    Vout: number;
    AmountSat: number;
    Height: number;
    Confirmations: number;
    Address: string;
    Path: string;
    Locktime: number;
};

// Utxos is array of Utxo
type Utxos = Utxo[];

// BlockInfo contains extended block header data and a list of block txids
type BlockInfo = {
    hash: string;
    previousBlockHash: string;
    nextBlockHash: string;
    height: number;
    confirmations: number;
    size: number;
    time: number;
    version: number;
    merkleRoot: string;
    nonce: string;
    bits: string;
    difficulty: string;
    tx: string[];
};

// Block contains information about block
interface BlockbookBlock extends BlockInfo, Paging {
    txCount: number;
    txs: BlockbookTx[];
}
