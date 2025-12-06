import { logger } from "./logger.js"

export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
}

export function errorHandler(err, req, res, next) {
  logger.error({
    message: err.message,
    stack: err.stack,
  })

  const status = err.status || 500
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  })
}
