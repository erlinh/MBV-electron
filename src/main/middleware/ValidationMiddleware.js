class ValidationMiddleware {
  async process(message, next) {
    // Simple validation check
    if (!message || !message.type) {
      throw new Error('Invalid message: message or message type is missing');
    }
    
    // Continue processing
    return await next();
  }
}

module.exports = { ValidationMiddleware }; 