import morgan from "morgan"
import winston from "winston"

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
})

const morganStream = {
  write: (message) => logger.info(message.trim()),
}

export const loggerMiddleware = morgan("combined", { stream: morganStream })
export { logger }
