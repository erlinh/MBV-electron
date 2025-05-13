class MetricsMiddleware {
  constructor() {
    this.metrics = new Map();
  }
  
  async process(message, next) {
    const startTime = Date.now();
    
    try {
      const result = await next();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.recordMetrics(message.type, duration);
      
      return result;
    } catch (error) {
      // Even if there's an error, record the metrics
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.recordMetrics(message.type, duration);
      
      throw error;
    }
  }
  
  recordMetrics(messageType, duration) {
    const currentMetrics = this.metrics.get(messageType) || { count: 0, totalTime: 0 };
    
    currentMetrics.count++;
    currentMetrics.totalTime += duration;
    
    this.metrics.set(messageType, currentMetrics);
  }
  
  // Public method to get metrics
  getMetrics() {
    const result = [];
    
    for (const [messageType, { count, totalTime }] of this.metrics.entries()) {
      result.push({
        messageType,
        count,
        avgTime: count > 0 ? totalTime / count : 0,
      });
    }
    
    return result;
  }
}

module.exports = { MetricsMiddleware }; 