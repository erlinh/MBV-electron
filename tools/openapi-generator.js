const fs = require('fs');
const path = require('path');
const ts = require('typescript');

/**
 * Generates OpenAPI documentation from TypeScript command and query interfaces.
 * 
 * This tool parses the TypeScript interfaces in the shared directory
 * and generates an OpenAPI schema that documents all the available messages
 * and their expected payloads.
 */
function generateOpenAPISpec() {
  const sharedDir = path.join(__dirname, '../src/shared');
  const commandsDir = path.join(sharedDir, 'commands');
  const queriesDir = path.join(sharedDir, 'queries');
  
  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'MBV Notes API',
      version: '1.0.0',
      description: 'API documentation for MBV Notes application',
    },
    paths: {
      '/api/message': {
        post: {
          summary: 'Send a message to the backend',
          description: 'Generic endpoint for sending any command or query to the backend',
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
                      enum: [], // Will be filled later
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
    components: {
      schemas: {
        // Will be filled with schemas for each message type
      },
    },
  };
  
  // Parse all command and query files to extract message types
  const messageTypes = [];
  const schemas = {};
  
  // Function to process a TypeScript file
  function processFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(
      filePath,
      fileContent,
      ts.ScriptTarget.Latest,
      true
    );
    
    // Find all interfaces that extend Message
    sourceFile.forEachChild(node => {
      if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
        const interfaceDecl = node;
        
        // Check if this interface extends Message
        const extendsMessage = interfaceDecl.heritageClauses?.some(
          clause => clause.token === ts.SyntaxKind.ExtendsKeyword &&
            clause.types.some(type => 
              type.expression.escapedText === 'Message'
            )
        );
        
        if (extendsMessage) {
          const interfaceName = interfaceDecl.name.escapedText;
          
          // Extract the 'type' property value
          const typeProperty = interfaceDecl.members.find(
            member => member.name?.escapedText === 'type'
          );
          
          if (typeProperty && typeProperty.type.kind === ts.SyntaxKind.LiteralType) {
            const messageType = typeProperty.type.literal.text;
            messageTypes.push(messageType);
            
            // Create a schema for this message type
            const schema = {
              type: 'object',
              required: ['type', 'payload'],
              properties: {
                type: {
                  type: 'string',
                  enum: [messageType],
                },
                payload: {
                  type: 'object',
                  properties: {},
                  required: [],
                },
              },
            };
            
            // Extract payload properties
            const payloadProperty = interfaceDecl.members.find(
              member => member.name?.escapedText === 'payload'
            );
            
            if (payloadProperty && payloadProperty.type) {
              // This is a simplified approach - a full implementation would
              // recursively process the type declaration to extract all properties
              payloadProperty.type.members?.forEach(member => {
                const propName = member.name.escapedText;
                
                // Add to required array if not optional
                if (!member.questionToken) {
                  schema.properties.payload.required.push(propName);
                }
                
                // Determine property type (simplified)
                let propType = 'string';
                if (member.type) {
                  if (member.type.kind === ts.SyntaxKind.StringKeyword) {
                    propType = 'string';
                  } else if (member.type.kind === ts.SyntaxKind.NumberKeyword) {
                    propType = 'number';
                  } else if (member.type.kind === ts.SyntaxKind.BooleanKeyword) {
                    propType = 'boolean';
                  } else if (member.type.kind === ts.SyntaxKind.ArrayType) {
                    propType = 'array';
                  } else if (member.type.kind === ts.SyntaxKind.TypeLiteral) {
                    propType = 'object';
                  }
                }
                
                schema.properties.payload.properties[propName] = {
                  type: propType,
                };
              });
            }
            
            schemas[messageType] = schema;
          }
        }
      }
    });
  }
  
  // Process all command files
  fs.readdirSync(commandsDir).forEach(file => {
    if (file.endsWith('.ts')) {
      processFile(path.join(commandsDir, file));
    }
  });
  
  // Process all query files
  fs.readdirSync(queriesDir).forEach(file => {
    if (file.endsWith('.ts')) {
      processFile(path.join(queriesDir, file));
    }
  });
  
  // Update the OpenAPI spec with discovered message types
  openApiSpec.paths['/api/message'].post.requestBody.content['application/json'].schema.properties.type.enum = messageTypes;
  
  // Add schemas to components
  openApiSpec.components.schemas = schemas;
  
  // Write the OpenAPI spec to a file
  const outputFile = path.join(__dirname, '../dist/openapi.json');
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(openApiSpec, null, 2));
  
  console.log(`OpenAPI documentation generated at ${outputFile}`);
}

// Run the generator if this file is executed directly
if (require.main === module) {
  generateOpenAPISpec();
}

module.exports = { generateOpenAPISpec }; 