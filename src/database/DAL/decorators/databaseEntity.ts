export default function DatabaseEntity(databaseName: string) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        return class extends constructor {
            __DATABASE_NAME__ = databaseName;
        }
    }

}

