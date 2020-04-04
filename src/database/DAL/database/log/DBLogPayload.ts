import ITransaction from "../transactions/ITransaction";

export type DBLogPayload = {
    transaction: ITransaction;
    database?: string;
    parent: string;
    grantAccessTo?: string;
};
