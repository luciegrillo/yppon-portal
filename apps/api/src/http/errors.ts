import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { Type } from '@sinclair/typebox';

type HttpErrorLike = Pick<FastifyError, 'message' | 'statusCode' | 'validation'>;

export class HttpError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.name = 'HttpError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

type ErrorMetadata = {
  code?: string;
  name: string;
  validationContext?: string;
};

export const ErrorResponseSchema = Type.Object({
  error: Type.Object({
    code: Type.String(),
    message: Type.String(),
    requestId: Type.String(),
  }),
});

export function registerErrorHandlers(app: FastifyInstance) {
  app.setNotFoundHandler((request, reply) => {
    sendError(reply, request, 404, 'NOT_FOUND', 'Recurso não encontrado.');
  });

  app.setErrorHandler((error, request, reply) => {
    const publicError = resolvePublicError(error);

    if (publicError.statusCode >= 500) {
      request.log.error(
        {
          error: resolveErrorMetadata(error),
          statusCode: publicError.statusCode,
        },
        'Request failed',
      );
    } else {
      request.log.warn(
        { code: publicError.code, statusCode: publicError.statusCode },
        'Request rejected',
      );
    }

    sendError(
      reply,
      request,
      publicError.statusCode,
      publicError.code,
      publicError.message,
    );
  });
}

function resolvePublicError(error: unknown) {
  if (error instanceof HttpError) {
    const statusCode = normalizeStatusCode(error.statusCode);

    if (statusCode >= 500) {
      return {
        code: 'INTERNAL_ERROR',
        message: 'Não foi possível processar a requisição.',
        statusCode,
      };
    }

    return {
      code: error.code,
      message: error.message,
      statusCode,
    };
  }

  const statusCode = asHttpErrorLike(error)?.statusCode ?? 500;
  const safeStatusCode = normalizeStatusCode(statusCode);

  if (safeStatusCode >= 500) {
    return {
      code: 'INTERNAL_ERROR',
      message: 'Não foi possível processar a requisição.',
      statusCode: safeStatusCode,
    };
  }

  if (asHttpErrorLike(error)?.validation) {
    return {
      code: 'VALIDATION_ERROR',
      message: 'Parâmetros da requisição inválidos.',
      statusCode: 400,
    };
  }

  return {
    code: 'REQUEST_ERROR',
    message: 'Requisição inválida.',
    statusCode: safeStatusCode,
  };
}

function normalizeStatusCode(statusCode: number) {
  return statusCode >= 400 && statusCode <= 599 ? statusCode : 500;
}

function asHttpErrorLike(error: unknown): HttpErrorLike | undefined {
  if (typeof error !== 'object' || error === null) return undefined;

  return error as HttpErrorLike;
}

export function resolveErrorMetadata(error: unknown): ErrorMetadata {
  if (!(error instanceof Error)) {
    return { name: 'UnknownError' };
  }

  const fastifyError = error as FastifyError;

  return {
    name: error.name,
    ...(fastifyError.code ? { code: fastifyError.code } : {}),
    ...(fastifyError.validationContext
      ? { validationContext: fastifyError.validationContext }
      : {}),
  };
}

function sendError(
  reply: FastifyReply,
  request: FastifyRequest,
  statusCode: number,
  code: string,
  message: string,
) {
  return reply.status(statusCode).send({
    error: {
      code,
      message,
      requestId: request.id,
    },
  });
}
