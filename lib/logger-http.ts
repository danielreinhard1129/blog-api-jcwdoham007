import { pinoHttp } from "pino-http";
import { randomUUID } from "crypto";
import { logger } from "./logger.js";

export const loggerHttp = pinoHttp({
  logger: logger,

  genReqId: () => randomUUID(),

  customLogLevel(req, res, error) {
    if (error || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  serializers: {
    req(req) {
      return { method: req.method, url: req.url, reqId: req.id };
    },
    res(res) {
      return { statusCode: res.statusCode };
    },
  },
});
