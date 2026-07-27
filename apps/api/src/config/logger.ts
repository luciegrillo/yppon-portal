import type { FastifyServerOptions } from 'fastify';

type LoggerOptions = Exclude<NonNullable<FastifyServerOptions['logger']>, boolean>;

type LoggerStream = {
  write(message: string): void;
};

type BuildLoggerOptions = {
  level: string;
  stream?: LoggerStream;
};

const REDACTION_CENSOR = '[REDACTED]';

export const LOG_REDACTION_PATHS = [
  'authorization',
  'cookie',
  'password',
  'token',
  'accessToken',
  'professionalToken',
  'virtualKey',
  'databaseUrl',
  'headers',
  'body',
  'query',
  'params',
  'err',
  'error.message',
  'error.stack',
  'req.headers',
  'req.body',
  'req.query',
  'req.params',
  'res.headers',
  'config.databaseUrl',
  'env.DATABASE_URL',
] as const;

export function buildLoggerOptions({ level, stream }: BuildLoggerOptions): LoggerOptions {
  return {
    level,
    redact: {
      censor: REDACTION_CENSOR,
      paths: [...LOG_REDACTION_PATHS],
    },
    serializers: {
      req(request) {
        return {
          method: request.method,
          path: resolveRequestPath(request.url),
          remoteAddress: request.ip,
          remotePort: request.socket.remotePort,
        };
      },
      res(reply) {
        return {
          statusCode: reply.statusCode,
        };
      },
    },
    ...(stream ? { stream } : {}),
  };
}

function resolveRequestPath(rawUrl: string) {
  try {
    return new URL(rawUrl, 'http://localhost').pathname;
  } catch {
    return '/';
  }
}
