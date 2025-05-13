import { create } from 'zustand';
import { ClientMessageBus } from '../messageBus/ClientMessageBus';
import { NoteModel } from '../../shared/models/types';
import { 
  CreateNoteCommand, 
  UpdateNoteCommand, 
  DeleteNoteCommand, 
  AddTagCommand 
} from '../../shared/commands/noteCommands';
import { 
  GetNotesQuery, 
  GetNoteByIdQuery, 
  GetTagsQuery 
} from '../../shared/queries/noteQueries';

// Create a singleton message bus
const messageBus = new ClientMessageBus();

// Types for the store
interface NoteState {
  notes: NoteModel[];
  currentNote: NoteModel | null;
  tags: string[];
  isLoading: boolean;
  totalNotes: number;
  error: string | null;
  
  // Actions
  fetchNotes: (searchTerm?: string, tags?: string[], skip?: number, take?: number) => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  fetchTags: () => Promise<void>;
  createNote: (title: string, content: string, tags?: string[]) => Promise<string>;
  updateNote: (id: string, title?: string, content?: string, tags?: string[]) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addTag: (noteId: string, tag: string) => Promise<void>;
  setCurrentNote: (note: NoteModel | null) => void;
  clearError: () => void;
}

// Create the store
export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  currentNote: null,
  tags: [],
  isLoading: false,
  totalNotes: 0,
  error: null,
  
  fetchNotes: async (searchTerm, tags, skip = 0, take = 10) => {
    set({ isLoading: true, error: null });
    
    try {
      const query: GetNotesQuery = {
        type: 'GetNotesQuery',
        payload: { searchTerm, tags, skip, take }
      };
      
      const result = await messageBus.send<any>(query);
      
      if (result.error) {
        set({ error: result.error, isLoading: false });
        return;
      }
      
      set({ 
        notes: result.notes, 
        totalNotes: result.total, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching notes:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch notes', 
        isLoading: false 
      });
    }
  },
  
  fetchNoteById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const query: GetNoteByIdQuery = {
        type: 'GetNoteByIdQuery',
        payload: { id }
      };
      
      const result = await messageBus.send<any>(query);
      
      if (result.error) {
        set({ error: result.error, isLoading: false });
        return;
      }
      
      set({ currentNote: result.note, isLoading: false });
    } catch (error) {
      console.error('Error fetching note:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch note', 
        isLoading: false 
      });
    }
  },
  
  fetchTags: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const query: GetTagsQuery = {
        type: 'GetTagsQuery',
        payload: {}
      };
      
      const result = await messageBus.send<any>(query);
      
      set({ tags: result.tags, isLoading: false });
    } catch (error) {
      console.error('Error fetching tags:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tags', 
        isLoading: false 
      });
    }
  },
  
  createNote: async (title, content, tags = []) => {
    set({ isLoading: true, error: null });
    
    try {
      const command: CreateNoteCommand = {
        type: 'CreateNoteCommand',
        payload: { title, content, tags }
      };
      
      const result = await messageBus.send<any>(command);
      
      if (!result.success) {
        set({ error: result.error, isLoading: false });
        return '';
      }
      
      // Refresh the notes list
      await get().fetchNotes();
      
      set({ isLoading: false });
      return result.noteId;
    } catch (error) {
      console.error('Error creating note:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create note', 
        isLoading: false 
      });
      return '';
    }
  },
  
  updateNote: async (id, title, content, tags) => {
    set({ isLoading: true, error: null });
    
    try {
      const command: UpdateNoteCommand = {
        type: 'UpdateNoteCommand',
        payload: { id, title, content, tags }
      };
      
      const result = await messageBus.send<any>(command);
      
      if (!result.success) {
        set({ error: result.error, isLoading: false });
        return;
      }
      
      // Refresh the notes list and current note
      await get().fetchNotes();
      if (get().currentNote?.id === id) {
        await get().fetchNoteById(id);
      }
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error updating note:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update note', 
        isLoading: false 
      });
    }
  },
  
  deleteNote: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const command: DeleteNoteCommand = {
        type: 'DeleteNoteCommand',
        payload: { id }
      };
      
      const result = await messageBus.send<any>(command);
      
      if (!result.success) {
        set({ error: result.error, isLoading: false });
        return;
      }
      
      // Clear current note if deleted
      if (get().currentNote?.id === id) {
        set({ currentNote: null });
      }
      
      // Refresh the notes list
      await get().fetchNotes();
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error deleting note:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete note', 
        isLoading: false 
      });
    }
  },
  
  addTag: async (noteId, tag) => {
    set({ isLoading: true, error: null });
    
    try {
      const command: AddTagCommand = {
        type: 'AddTagCommand',
        payload: { noteId, tag }
      };
      
      const result = await messageBus.send<any>(command);
      
      if (!result.success) {
        set({ error: result.error, isLoading: false });
        return;
      }
      
      // Refresh the notes list, current note, and tags
      await get().fetchNotes();
      if (get().currentNote?.id === noteId) {
        await get().fetchNoteById(noteId);
      }
      await get().fetchTags();
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error adding tag:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add tag', 
        isLoading: false 
      });
    }
  },
  
  setCurrentNote: (note) => {
    set({ currentNote: note });
  },
  
  clearError: () => {
    set({ error: null });
  }
})); 