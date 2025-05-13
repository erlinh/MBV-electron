const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { messageBus } = require('../ipc/setup');

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

// Message-based endpoint
app.post('/api/message', async (req, res) => {
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

// REST endpoints for Notes
app.get('/api/notes', async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const tags = req.query.tags ? req.query.tags.split(',') : undefined;
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 10;
    
    const result = await messageBus.send({
      type: 'GetNotesQuery',
      payload: { searchTerm, tags, skip, take }
    });
    
    res.json(result);
  } catch (error) {
    console.error('[API] Error getting notes:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/api/notes/:id', async (req, res) => {
  try {
    const result = await messageBus.send({
      type: 'GetNoteByIdQuery',
      payload: { id: req.params.id }
    });
    
    if (result.error) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json(result);
  } catch (error) {
    console.error('[API] Error getting note by id:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    const result = await messageBus.send({
      type: 'CreateNoteCommand',
      payload: { title, content, tags }
    });
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('[API] Error creating note:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    const result = await messageBus.send({
      type: 'UpdateNoteCommand',
      payload: { id: req.params.id, title, content, tags }
    });
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result);
  } catch (error) {
    console.error('[API] Error updating note:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const result = await messageBus.send({
      type: 'DeleteNoteCommand',
      payload: { id: req.params.id }
    });
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }
    
    res.json(result);
  } catch (error) {
    console.error('[API] Error deleting note:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/api/notes/:id/tags', async (req, res) => {
  try {
    const { tag } = req.body;
    
    const result = await messageBus.send({
      type: 'AddTagCommand',
      payload: { noteId: req.params.id, tag }
    });
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result);
  } catch (error) {
    console.error('[API] Error adding tag:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/api/tags', async (req, res) => {
  try {
    const result = await messageBus.send({
      type: 'GetTagsQuery',
      payload: {}
    });
    
    res.json(result);
  } catch (error) {
    console.error('[API] Error getting tags:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// REST endpoints for Preferences
app.get('/api/preferences', async (req, res) => {
  try {
    const result = await messageBus.send({
      type: 'GetPreferencesQuery',
      payload: {}
    });
    
    res.json(result);
  } catch (error) {
    console.error('[API] Error getting preferences:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.put('/api/preferences', async (req, res) => {
  try {
    const result = await messageBus.send({
      type: 'UpdatePreferencesCommand',
      payload: req.body
    });
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    res.json(result);
  } catch (error) {
    console.error('[API] Error updating preferences:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Update the OpenAPI documentation to include the new REST endpoints
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
    '/api/notes': {
      get: {
        summary: 'Get all notes',
        parameters: [
          {
            name: 'search',
            in: 'query',
            description: 'Search term',
            schema: { type: 'string' }
          },
          {
            name: 'tags',
            in: 'query',
            description: 'Comma-separated list of tags',
            schema: { type: 'string' }
          },
          {
            name: 'skip',
            in: 'query',
            description: 'Number of notes to skip (pagination)',
            schema: { type: 'integer', default: 0 }
          },
          {
            name: 'take',
            in: 'query',
            description: 'Number of notes to return (pagination)',
            schema: { type: 'integer', default: 10 }
          }
        ],
        responses: {
          '200': {
            description: 'List of notes',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    notes: {
                      type: 'array',
                      items: { type: 'object' }
                    },
                    total: {
                      type: 'integer'
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new note',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'content'],
                properties: {
                  title: {
                    type: 'string',
                    description: 'Note title'
                  },
                  content: {
                    type: 'string',
                    description: 'Note content'
                  },
                  tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Note tags'
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Note created successfully'
          },
          '400': {
            description: 'Bad request'
          }
        }
      }
    },
    '/api/notes/{id}': {
      get: {
        summary: 'Get a note by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Note ID',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Note details'
          },
          '404': {
            description: 'Note not found'
          }
        }
      },
      put: {
        summary: 'Update a note',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Note ID',
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'Note title'
                  },
                  content: {
                    type: 'string',
                    description: 'Note content'
                  },
                  tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Note tags'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Note updated successfully'
          },
          '400': {
            description: 'Bad request'
          },
          '404': {
            description: 'Note not found'
          }
        }
      },
      delete: {
        summary: 'Delete a note',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Note ID',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Note deleted successfully'
          },
          '404': {
            description: 'Note not found'
          }
        }
      }
    },
    '/api/notes/{id}/tags': {
      post: {
        summary: 'Add a tag to a note',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Note ID',
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['tag'],
                properties: {
                  tag: {
                    type: 'string',
                    description: 'Tag to add'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Tag added successfully'
          },
          '400': {
            description: 'Bad request'
          },
          '404': {
            description: 'Note not found'
          }
        }
      }
    },
    '/api/tags': {
      get: {
        summary: 'Get all tags',
        responses: {
          '200': {
            description: 'List of all tags',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tags: {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/preferences': {
      get: {
        summary: 'Get user preferences',
        responses: {
          '200': {
            description: 'User preferences',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    preferences: {
                      type: 'object',
                      properties: {
                        theme: {
                          type: 'string',
                          enum: ['light', 'dark']
                        },
                        fontSize: {
                          type: 'integer'
                        },
                        autoSave: {
                          type: 'boolean'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update user preferences',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  theme: {
                    type: 'string',
                    enum: ['light', 'dark']
                  },
                  fontSize: {
                    type: 'integer'
                  },
                  autoSave: {
                    type: 'boolean'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Preferences updated successfully'
          },
          '400': {
            description: 'Bad request'
          }
        }
      }
    },
    '/': {
      get: {
        summary: 'Health check endpoint',
        description: 'Returns status of the API server',
        responses: {
          '200': {
            description: 'API server status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'API server is running'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root path for health check
app.get('/', (req, res) => {
  res.json({ status: 'API server is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`[API] Development API server running on port ${PORT}`);
  console.log(`[API] OpenAPI documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`[API] REST endpoints available at http://localhost:${PORT}/api/`);
}); 