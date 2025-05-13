"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteRepository = void 0;
const electron_1 = require("electron");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
class NoteRepository {
    constructor() {
        this.notes = new Map();
        this.storageDir = path_1.default.join(electron_1.app.getPath('userData'), 'storage');
        this.notesFile = path_1.default.join(this.storageDir, 'notes.json');
        this.initStorage();
        this.loadNotes();
    }
    initStorage() {
        if (!fs_1.default.existsSync(this.storageDir)) {
            fs_1.default.mkdirSync(this.storageDir, { recursive: true });
        }
        if (!fs_1.default.existsSync(this.notesFile)) {
            fs_1.default.writeFileSync(this.notesFile, JSON.stringify([]));
        }
    }
    loadNotes() {
        try {
            const data = fs_1.default.readFileSync(this.notesFile, 'utf-8');
            const noteArray = JSON.parse(data);
            this.notes.clear();
            noteArray.forEach(note => {
                this.notes.set(note.id, note);
            });
        }
        catch (error) {
            console.error('Failed to load notes:', error);
        }
    }
    saveNotes() {
        try {
            const noteArray = Array.from(this.notes.values());
            fs_1.default.writeFileSync(this.notesFile, JSON.stringify(noteArray, null, 2));
        }
        catch (error) {
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
            id: (0, uuid_1.v4)(),
            ...note,
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
            filteredNotes = filteredNotes.filter(note => note.title.toLowerCase().includes(term) ||
                note.content.toLowerCase().includes(term));
        }
        if (tags && tags.length > 0) {
            filteredNotes = filteredNotes.filter(note => tags.some(tag => note.tags.includes(tag)));
        }
        // Sort by updated date, newest first
        filteredNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        return {
            notes: filteredNotes.slice(skip, skip + take),
            total: filteredNotes.length,
        };
    }
    async getAllTags() {
        const tagSet = new Set();
        for (const note of this.notes.values()) {
            for (const tag of note.tags) {
                tagSet.add(tag);
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
        }
        catch (error) {
            console.error('Failed to import notes:', error);
            throw new Error('Failed to import notes: Invalid format');
        }
    }
    async exportNotes(format) {
        const notes = Array.from(this.notes.values());
        if (format === 'json') {
            return JSON.stringify(notes, null, 2);
        }
        else {
            // Convert to markdown
            return notes.map(note => {
                const tags = note.tags.map(tag => `#${tag}`).join(' ');
                return `# ${note.title}\n\n${note.content}\n\nTags: ${tags}\n\n---\n\n`;
            }).join('');
        }
    }
}
exports.NoteRepository = NoteRepository;
