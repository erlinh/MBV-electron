import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { messageBus } from '../ipc/setup';

// Create Express application
const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// Endpoints
app.post('/api/message', async (req: Request, res: Response) => {
  try {
    const { type, payload } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: 'Message type is required' });
    }
    
    const message = { type, payload };
    const result = await messageBus.send(message);
    
    res.json(result);
  } catch (error) {
    console.error('[API] Error handling message:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// OpenAPI documentation
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'MBV Notes API',
    version: '1.0.0',
    description: 'API for MBV Notes application',
  },
  paths: {
    '/api/message': {
      post: {
        summary: 'Send a message to the backend',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['type', 'payload'],
                properties: {
                  type: {
                    type: 'string',
                    description: 'The message type',
                  },
                  payload: {
                    type: 'object',
                    description: 'The message payload',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                },
              },
            },
          },
          '400': {
            description: 'Bad request',
          },
          '500': {
            description: 'Server error',
          },
        },
      },
    },
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server
app.listen(PORT, () => {
  console.log(`[API] Development API server running on port ${PORT}`);
  console.log(`[API] OpenAPI documentation available at http://localhost:${PORT}/api-docs`);
}); 