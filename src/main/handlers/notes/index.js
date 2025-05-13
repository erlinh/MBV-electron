// Import the repository for persistence
const { NoteRepository } = require('../../persistence/NoteRepository');

// Create a singleton repository
const noteRepository = new NoteRepository();

function createNoteHandler() {
  return async (command) => {
    try {
      const { title, content, tags = [] } = command.payload;
      
      const newNote = await noteRepository.createNote({
        title,
        content,
        tags,
      });
      
      return {
        success: true,
        noteId: newNote.id,
      };
    } catch (error) {
      console.error('Error creating note:', error);
      return {
        success: false,
        noteId: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}

function updateNoteHandler() {
  return async (command) => {
    try {
      const { id, title, content, tags } = command.payload;
      
      const updatedNote = await noteRepository.updateNote(id, {
        title,
        content,
        tags,
      });
      
      if (!updatedNote) {
        return {
          success: false,
          error: `Note with id ${id} not found`,
        };
      }
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error updating note:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}

function deleteNoteHandler() {
  return async (command) => {
    try {
      const { id } = command.payload;
      
      const deleted = await noteRepository.deleteNote(id);
      
      if (!deleted) {
        return {
          success: false,
          error: `Note with id ${id} not found`,
        };
      }
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting note:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}

function addTagHandler() {
  return async (command) => {
    try {
      const { noteId, tag } = command.payload;
      
      const note = await noteRepository.getNoteById(noteId);
      
      if (!note) {
        return {
          success: false,
          error: `Note with id ${noteId} not found`,
        };
      }
      
      // Initialize tags if it doesn't exist
      if (!note.tags || !Array.isArray(note.tags)) {
        note.tags = [];
      }
      
      // Add tag if it doesn't already exist
      if (!note.tags.includes(tag)) {
        note.tags.push(tag);
        await noteRepository.updateNote(noteId, { tags: note.tags });
      }
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error adding tag:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}

function getNotesHandler() {
  return async (query) => {
    try {
      const { searchTerm, tags, skip, take } = query.payload;
      
      const result = await noteRepository.searchNotes(searchTerm, tags, skip, take);
      
      return {
        notes: result.notes,
        total: result.total,
      };
    } catch (error) {
      console.error('Error getting notes:', error);
      return {
        notes: [],
        total: 0,
      };
    }
  };
}

function getNoteByIdHandler() {
  return async (query) => {
    try {
      const { id } = query.payload;
      
      const note = await noteRepository.getNoteById(id);
      
      if (!note) {
        return {
          error: `Note with id ${id} not found`,
        };
      }
      
      return {
        note,
      };
    } catch (error) {
      console.error('Error getting note by id:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}

function getTagsHandler() {
  return async () => {
    try {
      const tags = await noteRepository.getAllTags();
      
      return {
        tags,
      };
    } catch (error) {
      console.error('Error getting tags:', error);
      return {
        tags: [],
      };
    }
  };
}

function registerNoteHandlers(messageBus) {
  // Register command handlers
  messageBus.registerHandler('CreateNoteCommand', createNoteHandler());
  messageBus.registerHandler('UpdateNoteCommand', updateNoteHandler());
  messageBus.registerHandler('DeleteNoteCommand', deleteNoteHandler());
  messageBus.registerHandler('AddTagCommand', addTagHandler());
  
  // Register query handlers
  messageBus.registerHandler('GetNotesQuery', getNotesHandler());
  messageBus.registerHandler('GetNoteByIdQuery', getNoteByIdHandler());
  messageBus.registerHandler('GetTagsQuery', getTagsHandler());
}

module.exports = { registerNoteHandlers }; 