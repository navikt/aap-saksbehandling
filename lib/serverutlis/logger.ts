import pino from 'pino';

const logger = pino({
  formatters: {
    level: (label) => {
      return { level: label };
    },
    log: (object: any) => {
      if (object.err) {
        const err = object.err instanceof Error ? pino.stdSerializers.err(object.err) : object.err;
        object.stack_trace = err.stack;
        object.type = err.type;
        object.error_message = err.message;

        // Spesifikt for [ClientError]
        object.x_error_digest = err.digest;
        object.x_saksnummer = err.saksnummer;
        object.x_behandlingsreferanse = err.behandlingsReferanse;
        object.x_pathname = err.pathname;

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
