import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { appConfig } from './config';
import { storageRoutes } from './api/routes/storage.routes';

const server = Fastify({
  logger: {
    level: appConfig.LOG_LEVEL,
    transport:
      appConfig.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
});

// Register plugins
async function build() {
  // Security headers
  await server.register(helmet, {
    contentSecurityPolicy: false, // Allow inline scripts for development
  });

  // CORS
  await server.register(cors, {
    origin: appConfig.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
  });

  // Routes
  await server.register(storageRoutes);

  // Error handler
  server.setErrorHandler((error, _request, reply) => {
    server.log.error(error);
    
    if (error.validation) {
      return reply.status(400).send({
        error: 'Validation error',
        details: error.validation,
      });
    }

    return reply.status(error.statusCode || 500).send({
      error: error.message || 'Internal server error',
    });
  });

  // Not found handler
  server.setNotFoundHandler((request, reply) => {
    return reply.status(404).send({
      error: 'Not found',
      path: request.url,
    });
  });
}

async function start() {
  try {
    await build();
    
    const address = await server.listen({
      port: appConfig.PORT,
      host: '0.0.0.0',
    });

    server.log.info(`🚀 Server listening on ${address}`);
    server.log.info(`📊 Environment: ${appConfig.NODE_ENV}`);
    server.log.info(`🔗 RPC URL: ${appConfig.RPC_URL}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  server.log.info('Shutting down gracefully...');
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  server.log.info('Shutting down gracefully...');
  await server.close();
  process.exit(0);
});

start();

