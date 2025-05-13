const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class NoteRepository {
  constructor() {
    this.storageDir = path.join(app.getPath('userData'), 'storage');
    this.notesFile = path.join(this.storageDir, 'notes.json');
    this.notes = new Map();
    this.initStorage();
    this.loadNotes();
  }

  initStorage() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.notesFile)) {
      fs.writeFileSync(this.notesFile, JSON.stringify([]));
    }
  }

  loadNotes() {
    try {
      const data = fs.readFileSync(this.notesFile, 'utf-8');
      const noteArray = JSON.parse(data);
      
      this.notes.clear();
      noteArray.forEach(note => {
        this.notes.set(note.id, note);
      });
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  }

  saveNotes() {
    try {
      const noteArray = Array.from(this.notes.values());
      fs.writeFileSync(this.notesFile, JSON.stringify(noteArray, null, 2));
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  }

  async getAllNotes() {
    return Array.from(this.notes.values());
  }

  async getNoteById(id) {
    return this.notes.get(id);
  }

  async createNote(note) {
    const now = new Date().toISOString();
    const newNote = {
      id: uuidv4(),
      ...note,
      tags: Array.isArray(note.tags) ? note.tags : [],
      createdAt: now,
      updatedAt: now,
    };
    
    this.notes.set(newNote.id, newNote);
    this.saveNotes();
    
    return newNote;
  }

  async updateNote(id, updateData) {
    const existingNote = this.notes.get(id);
    
    if (!existingNote) {
      return undefined;
    }
    
    // If tags is being updated, ensure it's an array
    if (updateData.tags !== undefined) {
      updateData.tags = Array.isArray(updateData.tags) ? updateData.tags : [];
    }
    
    const updatedNote = {
      ...existingNote,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    this.notes.set(id, updatedNote);
    this.saveNotes();
    
    return updatedNote;
  }

  async deleteNote(id) {
    const deleted = this.notes.delete(id);
    
    if (deleted) {
      this.saveNotes();
    }
    
    return deleted;
  }

  async searchNotes(searchTerm, tags, skip = 0, take = 20) {
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

  async getAllTags() {
    const tagSet = new Set();
    
    for (const note of this.notes.values()) {
      if (note.tags && Array.isArray(note.tags)) {
        for (const tag of note.tags) {
          tagSet.add(tag);
        }
      }
    }
    
    return Array.from(tagSet);
  }

  async importNotes(notesData) {
    try {
      const notesToImport = JSON.parse(notesData);
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

  async exportNotes(format = 'json') {
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

module.exports = { NoteRepository }; 