import React, { useState, useEffect } from 'react';
import { Message } from '../../shared/models/types';

// Styles for the inspector
const styles = {
  container: {
    position: 'fixed' as const,
    bottom: '0',
    right: '0',
    width: '400px',
    height: '300px',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '4px 0 0 0',
    zIndex: 9999,
    fontFamily: 'monospace',
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  header: {
    padding: '8px',
    backgroundColor: '#333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: '0',
    fontSize: '14px',
    fontWeight: 'bold' as const,
  },
  button: {
    padding: '2px 6px',
    backgroundColor: '#444',
    border: 'none',
    borderRadius: '3px',
    color: '#fff',
    cursor: 'pointer',
    marginLeft: '8px',
  },
  messagesContainer: {
    flex: 1,
    overflow: 'auto',
    padding: '8px',
  },
  message: {
    marginBottom: '8px',
    borderBottom: '1px solid #333',
    paddingBottom: '8px',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  messageType: {
    color: '#4caf50',
    fontWeight: 'bold' as const,
  },
  messageTime: {
    color: '#999',
  },
  messagePayload: {
    whiteSpace: 'pre-wrap' as const,
    color: '#90caf9',
  },
  messageResponse: {
    whiteSpace: 'pre-wrap' as const,
    color: '#ffab91',
    marginTop: '4px',
  },
  footer: {
    padding: '8px',
    borderTop: '1px solid #444',
    backgroundColor: '#333',
    display: 'flex',
    justifyContent: 'space-between',
  },
  minimized: {
    height: 'auto',
  },
};

interface MessageLog {
  id: number;
  message: Message;
  response: any;
  timestamp: number;
  duration: number;
}

// Create a global message queue
let messageQueue: MessageLog[] = [];
let nextId = 1;

// Public method to log messages from the MessageBus
export function logMessage(message: Message, response: any, duration: number): void {
  const log: MessageLog = {
    id: nextId++,
    message,
    response,
    timestamp: Date.now(),
    duration,
  };
  
  messageQueue = [log, ...messageQueue].slice(0, 100); // Keep only the last 100 messages
  
  // Dispatch an event to notify the inspector
  const event = new CustomEvent('mbv:message', { detail: log });
  window.dispatchEvent(event);
}

interface MessageInspectorProps {
  // No props needed
}

export const MessageInspector: React.FC<MessageInspectorProps> = () => {
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Load message queue on mount
    setMessages(messageQueue);
    
    // Subscribe to new messages
    const handleMessage = (event: Event) => {
      const customEvent = event as CustomEvent<MessageLog>;
      setMessages(prev => [customEvent.detail, ...prev].slice(0, 100));
    };
    
    window.addEventListener('mbv:message', handleMessage);
    
    return () => {
      window.removeEventListener('mbv:message', handleMessage);
    };
  }, []);
  
  if (!isVisible) {
    return (
      <button 
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 9999,
          padding: '5px 10px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
        onClick={() => setIsVisible(true)}
      >
        Show Inspector
      </button>
    );
  }
  
  return (
    <div style={{
      ...styles.container,
      ...(isMinimized ? styles.minimized : {}),
    }}>
      <div style={styles.header}>
        <h3 style={styles.title}>MBV Message Inspector</h3>
        <div>
          <button 
            style={styles.button} 
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? 'Expand' : 'Minimize'}
          </button>
          <button 
            style={styles.button} 
            onClick={() => setIsVisible(false)}
          >
            Close
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={{ color: '#999', textAlign: 'center', marginTop: '20px' }}>
                No messages yet
              </div>
            ) : (
              messages.map(log => (
                <div key={log.id} style={styles.message}>
                  <div style={styles.messageHeader}>
                    <span style={styles.messageType}>{log.message.type}</span>
                    <span style={styles.messageTime}>
                      {new Date(log.timestamp).toLocaleTimeString()} ({log.duration}ms)
                    </span>
                  </div>
                  <div style={styles.messagePayload}>
                    {JSON.stringify(log.message.payload, null, 2)}
                  </div>
                  <div style={styles.messageResponse}>
                    {JSON.stringify(log.response, null, 2)}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div style={styles.footer}>
            <span>{messages.length} messages</span>
            <button 
              style={styles.button} 
              onClick={() => {
                messageQueue = [];
                setMessages([]);
              }}
            >
              Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageInspector; 