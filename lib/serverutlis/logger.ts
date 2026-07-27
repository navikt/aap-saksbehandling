import pino from 'pino';

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null;
}

const logger = pino({
  formatters: {
    level: (label) => {
      return { level: label };
    },
    log: (object: Record<string, unknown>) => {
      if (object.err) {
        const raw = object.err instanceof Error ? pino.stdSerializers.err(object.err) : object.err;
        if (isRecord(raw)) {
          object.stack_trace = raw.stack;
          object.type = raw.type;
          object.error_message = raw.message;

          // Spesifikt for [ClientError]
          object.x_error_digest = raw.digest;
          object.x_saksnummer = raw.saksnummer;
          object.x_behandlingsreferanse = raw.behandlingsReferanse;
          object.x_pathname = raw.pathname;
        }

        delete object.err;
      }
      return object;
    },
  },
});
export function logInfo(message: string, error?: unknown, callid?: string) {
  const logObject = createLogObject(error, callid);

  logger.info(logObject, message);
}
export function logWarning(message: string, error?: unknown, callid?: string) {
  const logObject = createLogObject(error, callid);

  logger.warn(logObject, message);
}
export function logError(message: string, error?: unknown, callid?: string) {
  const logObject = createLogObject(error, callid);

  logger.error(logObject, message);
}
const createLogObject = (error?: unknown, callid?: string) => {
  const navCallid = callid ? { 'Nav-CallId': callid } : {};
  const err = error ? { err: error } : {};

  return {
    ...navCallid,
    ...err,
  };
};
