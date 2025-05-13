"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const setup_1 = require("../ipc/setup");
// Create Express application
const app = (0, express_1.default)();
const PORT = process.env.API_PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Logging middleware
app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
});
// Handle API messages
const handleMessage = async (req, res) => {
    try {
        const { type, payload } = req.body;
        if (!type) {
            return res.status(400).json({ error: 'Message type is required' });
        }
        const message = { type, payload };
        const result = await setup_1.messageBus.send(message);
        return res.json(result);
    }
    catch (error) {
        console.error('[API] Error handling message:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
// API Endpoints
app.post('/api/message', handleMessage);
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
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// Start the server
app.listen(PORT, () => {
    console.log(`[API] Development API server running on port ${PORT}`);
    console.log(`[API] OpenAPI documentation available at http://localhost:${PORT}/api-docs`);
});
