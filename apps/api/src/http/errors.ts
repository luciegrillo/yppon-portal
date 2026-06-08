import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { Type } from '@sinclair/typebox';

type HttpErrorLike = Pick<FastifyError, 'message' | 'statusCode'>;

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
    const statusCode = resolveStatusCode(error);
    const code = statusCode >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR';
    const message = resolvePublicMessage(error, statusCode);

    request.log.error({ err: error }, 'Request failed');
    sendError(reply, request, statusCode, code, message);
  });
}

function resolveStatusCode(error: unknown) {
  const statusCode = asHttpErrorLike(error)?.statusCode ?? 500;

  if (statusCode < 400 || statusCode > 599) return 500;

  return statusCode;
}

function resolvePublicMessage(error: unknown, statusCode: number) {
  if (statusCode >= 500) return 'Não foi possível processar a requisição.';

  return asHttpErrorLike(error)?.message ?? 'Requisição inválida.';
}

function asHttpErrorLike(error: unknown): HttpErrorLike | undefined {
  if (typeof error !== 'object' || error === null) return undefined;

  return error as HttpErrorLike;
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
