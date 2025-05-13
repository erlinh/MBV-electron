import React, { useState, useEffect } from 'react';
import { useNoteStore } from '../store/noteStore';
import { usePreferenceStore } from '../store/preferenceStore';

const NoteEditor: React.FC = () => {
  const { currentNote, updateNote, deleteNote, addTag } = useNoteStore();
  const { preferences } = usePreferenceStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  
  // When the current note changes, update the state
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setIsEditing(false);
    } else {
      setTitle('');
      setContent('');
    }
  }, [currentNote]);
  
  // Auto-save functionality
  useEffect(() => {
    if (isEditing && preferences.autoSave && currentNote) {
      // Clear any existing timer
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      // Set a new timer
      const timer = setTimeout(() => {
        handleSave();
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      setAutoSaveTimer(timer);
    }
    
    // Clean up timer on unmount
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [title, content, isEditing, preferences.autoSave]);
  
  const handleSave = () => {
    if (currentNote) {
      updateNote(currentNote.id, title, content);
      setIsEditing(false);
    }
  };
  
  const handleDelete = () => {
    if (currentNote) {
      if (window.confirm('Are you sure you want to delete this note?')) {
        deleteNote(currentNote.id);
      }
    }
  };
  
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentNote && newTag.trim()) {
      addTag(currentNote.id, newTag.trim());
      setNewTag('');
    }
  };
  
  if (!currentNote) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--secondary-color)',
        }}
      >
        No note selected
      </div>
    );
  }
  
  return (
    <div
      style={{
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setIsEditing(true);
          }}
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            border: 'none',
            borderBottom: '1px solid var(--border-color)',
            padding: '5px 0',
            backgroundColor: 'transparent',
            color: 'var(--text-color)',
            width: '70%',
          }}
        />
        
        <div>
          <button
            onClick={handleSave}
            style={{
              marginRight: '10px',
            }}
          >
            Save
          </button>
          
          <button
            onClick={handleDelete}
            className="secondary"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div
        style={{
          marginBottom: '10px',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {currentNote.tags && Array.isArray(currentNote.tags) ? 
          currentNote.tags.map(tag => (
            <span
              key={tag}
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                marginRight: '5px',
                marginBottom: '5px',
              }}
            >
              #{tag}
            </span>
          )) : null}
        
        <form onSubmit={handleAddTag} style={{ display: 'inline-flex' }}>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag..."
            style={{
              fontSize: '0.8rem',
              width: '100px',
              height: '25px',
            }}
          />
          <button
            type="submit"
            style={{
              fontSize: '0.8rem',
              padding: '2px 8px',
              height: '25px',
            }}
          >
            Add
          </button>
        </form>
      </div>
      
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsEditing(true);
        }}
        style={{
          flex: 1,
          padding: '10px',
          fontSize: '1rem',
          lineHeight: '1.5',
          resize: 'none',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-color)',
          border: '1px solid var(--border-color)',
        }}
      />
      
      {isEditing && preferences.autoSave && (
        <div
          style={{
            fontSize: '0.8rem',
            color: 'var(--secondary-color)',
            textAlign: 'right',
            marginTop: '5px',
          }}
        >
          Auto-saving...
        </div>
      )}
    </div>
  );
};

export default NoteEditor; 