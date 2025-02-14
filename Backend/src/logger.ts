/* istanbul ignore file */
import winston from "winston";

export const logger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.colorize({ all: true })
            ),
        }),
        new winston.transports.File({
            filename: 'all.log',
            format: winston.format.simple()
        })
    ]
});