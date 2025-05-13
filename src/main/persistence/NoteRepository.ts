import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NoteModel } from '../../shared/models/types';

export class NoteRepository {
  private storageDir: string;
  private notesFile: string;
  private notes: Map<string, NoteModel> = new Map();

  constructor() {
    this.storageDir = path.join(app.getPath('userData'), 'storage');
    this.notesFile = path.join(this.storageDir, 'notes.json');
    this.initStorage();
    this.loadNotes();
  }

  private initStorage(): void {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.notesFile)) {
      fs.writeFileSync(this.notesFile, JSON.stringify([]));
    }
  }

  private loadNotes(): void {
    try {
      const data = fs.readFileSync(this.notesFile, 'utf-8');
      const noteArray: NoteModel[] = JSON.parse(data);
      
      this.notes.clear();
      noteArray.forEach(note => {
        this.notes.set(note.id, note);
      });
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  }

  private saveNotes(): void {
    try {
      const noteArray = Array.from(this.notes.values());
      fs.writeFileSync(this.notesFile, JSON.stringify(noteArray, null, 2));
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  }

  async getAllNotes(): Promise<NoteModel[]> {
    return Array.from(this.notes.values());
  }

  async getNoteById(id: string): Promise<NoteModel | undefined> {
    return this.notes.get(id);
  }

  async createNote(note: Omit<NoteModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<NoteModel> {
    const now = new Date().toISOString();
    const newNote: NoteModel = {
      id: uuidv4(),
      ...note,
      createdAt: now,
      updatedAt: now,
    };
    
    this.notes.set(newNote.id, newNote);
    this.saveNotes();
    
    return newNote;
  }

  async updateNote(id: string, updateData: Partial<Omit<NoteModel, 'id' | 'createdAt' | 'updatedAt'>>): Promise<NoteModel | undefined> {
    const existingNote = this.notes.get(id);
    
    if (!existingNote) {
      return undefined;
    }
    
    const updatedNote: NoteModel = {
      ...existingNote,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    this.notes.set(id, updatedNote);
    this.saveNotes();
    
    return updatedNote;
  }

  async deleteNote(id: string): Promise<boolean> {
    const deleted = this.notes.delete(id);
    
    if (deleted) {
      this.saveNotes();
    }
    
    return deleted;
  }

  async searchNotes(searchTerm?: string, tags?: string[], skip = 0, take = 20): Promise<{ notes: NoteModel[], total: number }> {
    let filteredNotes = Array.from(this.notes.values());
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredNotes = filteredNotes.filter(note => 
        note.title.toLowerCase().includes(term) || 
        note.content.toLowerCase().includes(term)
      );
    }
    
    if (tags && tags.length > 0) {
      filteredNotes = filteredNotes.filter(note => 
        tags.some(tag => note.tags.includes(tag))
      );
    }
    
    // Sort by updated date, newest first
    filteredNotes.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    return {
      notes: filteredNotes.slice(skip, skip + take),
      total: filteredNotes.length,
    };
  }

  async getAllTags(): Promise<string[]> {
    const tagSet = new Set<string>();
    
    for (const note of this.notes.values()) {
      for (const tag of note.tags) {
        tagSet.add(tag);
      }
    }
    
    return Array.from(tagSet);
  }

  async importNotes(notesData: string): Promise<number> {
    try {
      const notesToImport: Omit<NoteModel, 'id' | 'createdAt' | 'updatedAt'>[] = JSON.parse(notesData);
      let count = 0;
      
      for (const noteData of notesToImport) {
        await this.createNote(noteData);
        count++;
      }
      
      return count;
    } catch (error) {
      console.error('Failed to import notes:', error);
      throw new Error('Failed to import notes: Invalid format');
    }
  }

  async exportNotes(format: 'json' | 'markdown'): Promise<string> {
    const notes = Array.from(this.notes.values());
    
    if (format === 'json') {
      return JSON.stringify(notes, null, 2);
    } else {
      // Convert to markdown
      return notes.map(note => {
        const tags = note.tags.map(tag => `#${tag}`).join(' ');
        return `# ${note.title}\n\n${note.content}\n\nTags: ${tags}\n\n---\n\n`;
      }).join('');
    }
  }
} 