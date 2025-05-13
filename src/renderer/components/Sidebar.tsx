import React from 'react';
import { useNoteStore } from '../store/noteStore';

const Sidebar: React.FC = () => {
  const { tags, fetchNotes } = useNoteStore();

  const handleTagClick = (tag: string) => {
    fetchNotes(undefined, [tag]);
  };
  
  return (
    <div
      style={{
        width: '200px',
        backgroundColor: 'var(--sidebar-bg)',
        height: '100%',
        padding: '20px',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2
        style={{
          fontSize: '1.2rem',
          marginBottom: '20px',
        }}
      >
        Tags
      </h2>
      
      <div>
        <button
          onClick={() => fetchNotes()}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--text-color)',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            padding: '5px 0',
            width: '100%',
            marginBottom: '10px',
          }}
        >
          All Notes
        </button>
        
        {tags.map(tag => (
          <div
            key={tag}
            onClick={() => handleTagClick(tag)}
            style={{
              cursor: 'pointer',
              padding: '5px 0',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                marginRight: '5px',
                color: 'var(--primary-color)',
              }}
            >
              #
            </span>
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 