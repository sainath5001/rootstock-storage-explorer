import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { storageService } from '../../services/storage.service';
import { cacheService } from '../../services/cache.service';
import { isValidAddress } from '../../utils/address';
import { rpcService } from '../../services/rpc.service';

const storageQuerySchema = z.object({
  address: z.string().refine((val) => isValidAddress(val), {
    message: 'Invalid contract address',
  }),
  maxSlots: z.coerce.number().int().positive().max(1000).optional(),
});

const storageBodySchema = z.object({
  address: z.string().refine((val) => isValidAddress(val), {
    message: 'Invalid contract address',
  }),
  abi: z.any().optional(),
  storageLayout: z.any().optional(),
  maxSlots: z.coerce.number().int().positive().max(1000).optional(),
});

const slotsBodySchema = z.object({
  address: z.string().refine((val) => isValidAddress(val), {
    message: 'Invalid contract address',
  }),
  slots: z.array(z.coerce.number().int().nonnegative()).max(100),
});

export async function storageRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/storage?address=<contractAddress>
   * Analyzes contract storage and returns slot view and variable view
   */
  fastify.get(
    '/api/storage',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const query = storageQuerySchema.parse(request.query);

        // Check cache
        const cacheKey = cacheService.getStorageKey(query.address);
        const cached = cacheService.get(cacheKey);
        if (cached) {
          return reply.send(cached);
        }

        // Analyze storage
        const result = await storageService.analyzeStorage(query.address);

        // Cache result
        cacheService.set(cacheKey, result);

        return reply.send(result);
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            error: 'Validation error',
            details: error.errors,
          });
        }

        fastify.log.error(error);
        return reply.status(500).send({
          error: 'Failed to analyze storage',
          message: error.message,
        });
      }
    }
  );

  /**
   * POST /api/storage
   * Analyzes contract storage with optional ABI and storage layout
   */
  fastify.post(
    '/api/storage',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = storageBodySchema.parse(request.body);

        // Check cache
        const cacheKey = cacheService.getStorageKey(body.address);
        const cached = cacheService.get(cacheKey);
        if (cached && !body.abi && !body.storageLayout) {
          return reply.send(cached);
        }

        // Analyze storage with provided ABI/layout
        const result = await storageService.analyzeStorage(
          body.address,
          body.abi,
          body.storageLayout
        );

        // Cache result (with shorter TTL if ABI/layout provided)
        cacheService.set(cacheKey, result, 60);

        return reply.send(result);
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            error: 'Validation error',
            details: error.errors,
          });
        }

        fastify.log.error(error);
        return reply.status(500).send({
          error: 'Failed to analyze storage',
          message: error.message,
        });
      }
    }
  );

  /**
   * POST /api/storage/slots
   * Gets storage for specific slots only
   */
  fastify.post(
    '/api/storage/slots',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = slotsBodySchema.parse(request.body);

        const result = await storageService.getStorageForSlots(
          body.address,
          body.slots
        );

        return reply.send({
          address: body.address,
          slots: result,
        });
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            error: 'Validation error',
            details: error.errors,
          });
        }

        fastify.log.error(error);
        return reply.status(500).send({
          error: 'Failed to get storage slots',
          message: error.message,
        });
      }
    }
  );

  /**
   * GET /api/health
   * Health check endpoint
   */
  fastify.get('/api/health', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Check RPC connection
      await rpcService.getBlockNumber();
      
      return reply.send({
        status: 'healthy',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return reply.status(503).send({
        status: 'unhealthy',
        error: error.message,
      });
    }
  });
}

