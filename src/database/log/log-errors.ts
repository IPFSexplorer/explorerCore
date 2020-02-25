export const IPFSNotDefinedError = () => new Error("IPFS instance not defined");
export const LogNotDefinedError = () => new Error("Log instance not defined");
export const NotALogError = () =>
    new Error("Given argument is not an instance of Log");
export const CannotJoinWithDifferentId = () =>
    new Error("Can't join logs with different IDs");
export const LtOrLteMustBeStringOrArray = () =>
    new Error("lt or lte must be a string or array of Entries");
