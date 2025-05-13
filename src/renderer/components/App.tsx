import React, { useEffect, useState } from 'react';
import { useNoteStore } from '../store/noteStore';
import { usePreferenceStore } from '../store/preferenceStore';
import NoteList from './NoteList';
import NoteEditor from './NoteEditor';
import Sidebar from './Sidebar';
import Header from './Header';
import ErrorBanner from './ErrorBanner';

const App: React.FC = () => {
  const { fetchNotes, fetchTags, error: noteError, clearError: clearNoteError } = useNoteStore();
  const { fetchPreferences, preferences, error: preferenceError, clearError: clearPreferenceError } = usePreferenceStore();
  const [error, setError] = useState<string | null>(null);
  
  // Set up the error handler
  useEffect(() => {
    if (noteError) {
      setError(noteError);
    } else if (preferenceError) {
      setError(preferenceError);
    } else {
      setError(null);
    }
  }, [noteError, preferenceError]);
  
  // Clear errors
  const handleClearError = () => {
    clearNoteError();
    clearPreferenceError();
  };
  
  // Load initial data
  useEffect(() => {
    fetchNotes();
    fetchTags();
    fetchPreferences();
  }, [fetchNotes, fetchTags, fetchPreferences]);
  
  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', preferences.theme);
    document.documentElement.style.fontSize = `${preferences.fontSize}px`;
  }, [preferences.theme, preferences.fontSize]);
  
  return (
    <div className="app">
      {error && <ErrorBanner error={error} onClose={handleClearError} />}
      <Header />
      <div className="app-container">
        <Sidebar />
        <NoteList />
        <NoteEditor />
      </div>
    </div>
  );
};

export default App; 