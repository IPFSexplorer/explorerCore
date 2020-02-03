import logger from "@/logger";

const MAX_HEIGHT = 100;

export default class BlocksGetter {

    constructor(maxHeight = MAX_HEIGHT) {
        this.maxHeight = maxHeight
    }
    private maxHeight: number;
    private height: Number = 1;

    public [Symbol.asyncIterator]() {
        return {
            next: async function () {
                return {
                    done: this.height > this.maxHeight,
                    value: await this.getBlock(this.height++)
                };
            }.bind(this)
        };
    }

    private async getBlock(height: Number) {
        try {
            return (await import("./blockData/" + height)).default;
        } catch (error) {
            logger.error(error);
            return null;
        }
    }
}
