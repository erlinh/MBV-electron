import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { ClientMessageBus } from './messageBus/ClientMessageBus';
import { LoggingMiddleware } from './messageBus/LoggingMiddleware';
import MessageInspector from './components/MessageInspector';

// Configure the message bus with middleware
export const messageBus = new ClientMessageBus();
messageBus.use(new LoggingMiddleware());

// Make the message bus available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).__messageBus = messageBus;
}

// Determine if we are in development mode
const isDev = typeof window !== 'undefined' && window.electron?.isDev;

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    {isDev && <MessageInspector />}
  </React.StrictMode>,
); 