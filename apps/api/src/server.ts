import { buildApp } from './app.js';
import { loadApiConfig } from './config/env.js';

const config = loadApiConfig();
const app = buildApp({
  logger: {
    level: config.logLevel,
  },
});

const shutdownSignals = ['SIGINT', 'SIGTERM'] as const;

async function start() {
  try {
    await app.listen({
      host: config.host,
      port: config.port,
    });
  } catch (error) {
    app.log.error({ err: error }, 'Failed to start API server');
    process.exitCode = 1;
  }
}

for (const signal of shutdownSignals) {
  process.once(signal, async () => {
    app.log.info({ signal }, 'Shutting down API server');
    await app.close();
  });
}

void start();
