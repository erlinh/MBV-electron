import React from 'react';

interface ErrorBannerProps {
  error: string;
  onClose: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onClose }) => {
  return (
    <div className="error-banner">
      <div>
        <strong>Error:</strong> {error}
      </div>
      <button 
        onClick={onClose}
        style={{
          backgroundColor: 'transparent',
          color: 'white',
          border: '1px solid white',
          padding: '2px 8px',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
      >
        Dismiss
      </button>
    </div>
  );
};

export default ErrorBanner; 