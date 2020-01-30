import winston from "winston";
import { config } from "dotenv";
import { createLogger, format, transports } from "winston";
import { consoleFormat } from "winston-console-format";
config();

const options: winston.LoggerOptions = {
    level: "silly",

    defaultMeta: { service: "Test" },
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize({ all: true }),
                format.padLevels(),
                consoleFormat({
                    showMeta: true,
                    metaStrip: ["timestamp", "service"],
                    inspectOptions: {
                        depth: Infinity,
                        colors: true,
                        maxArrayLength: Infinity,
                        breakLength: 120,
                        compact: Infinity
                    }
                })
            )
        })
    ]
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}

export default logger;
