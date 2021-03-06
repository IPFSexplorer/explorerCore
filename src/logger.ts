import winston from "winston";
import { config } from "dotenv";
config();

// const options: winston.LoggerOptions = {
//     level: "silly",
//     format: format.combine(format.timestamp(), format.splat(), format.json()),
//     defaultMeta: { service: "Test" },
//     transports: [
//         new transports.Console({
//             format: format.combine(
//                 format.colorize({ all: true }),
//                 format.padLevels(),
//                 consoleFormat({
//                     showMeta: true,
//                     metaStrip: ["timestamp", "service"],
//                     inspectOptions: {
//                         depth: Infinity,
//                         colors: true,
//                         maxArrayLength: Infinity,
//                         breakLength: 120,
//                         compact: Infinity
//                     }
//                 })
//             )
//         })
//     ]
// };

const logger = winston.createLogger();

if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}

export default logger;
