import React, { useState } from 'react';
import { useNoteStore } from '../store/noteStore';
import { NoteModel } from '../../shared/models/types';

const NoteList: React.FC = () => {
  const { notes, totalNotes, fetchNotes, setCurrentNote, createNote } = useNoteStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNotes(searchTerm);
  };
  
  const handleCreateNote = () => {
    createNote('New Note', 'Write something...', []);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div
      style={{
        width: '300px',
        borderRight: '1px solid var(--border-color)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '10px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <form onSubmit={handleSearch}>
          <div
            style={{
              display: 'flex',
              marginBottom: '10px',
            }}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              style={{
                flex: 1,
                marginRight: '10px',
              }}
            />
            <button type="submit">Search</button>
          </div>
        </form>
        
        <button
          onClick={handleCreateNote}
          style={{
            width: '100%',
          }}
        >
          Create Note
        </button>
      </div>
      
      <div
        style={{
          flex: 1,
          overflow: 'auto',
        }}
      >
        {notes.map((note: NoteModel) => (
          <div
            key={note.id}
            onClick={() => setCurrentNote(note)}
            style={{
              padding: '15px',
              borderBottom: '1px solid var(--border-color)',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--hover-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
            }}
          >
            <h3
              style={{
                margin: '0 0 5px 0',
                fontSize: '1rem',
              }}
            >
              {note.title}
            </h3>
            <p
              style={{
                margin: '0 0 5px 0',
                fontSize: '0.8rem',
                color: 'var(--secondary-color)',
              }}
            >
              {formatDate(note.updatedAt)}
            </p>
            <p
              style={{
                margin: '0',
                fontSize: '0.9rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {note.content.substring(0, 50)}
              {note.content.length > 50 ? '...' : ''}
            </p>
          </div>
        ))}
        
        {notes.length === 0 && (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              color: 'var(--secondary-color)',
            }}
          >
            No notes found
          </div>
        )}
      </div>
      
      <div
        style={{
          padding: '10px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          color: 'var(--secondary-color)',
          textAlign: 'center',
        }}
      >
        {totalNotes} {totalNotes === 1 ? 'note' : 'notes'} total
      </div>
    </div>
  );
};

export default NoteList; 