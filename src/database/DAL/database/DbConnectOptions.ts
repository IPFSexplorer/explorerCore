
export enum DbSyncStrategy {
    migrate,
    replace
}

export type DbOptions = {
    syncStrategy: DbSyncStrategy
}