import React from 'react';
import { usePreferenceStore } from '../store/preferenceStore';

const Header: React.FC = () => {
  const { preferences, updatePreferences } = usePreferenceStore();
  
  const toggleTheme = () => {
    updatePreferences({
      theme: preferences.theme === 'light' ? 'dark' : 'light',
    });
  };
  
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '1.5rem',
          }}
        >
          MBV Notes
        </h1>
      </div>
      
      <div>
        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            marginRight: '10px',
          }}
        >
          {preferences.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </header>
  );
};

export default Header; 