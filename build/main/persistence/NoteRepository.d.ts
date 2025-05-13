import { NoteModel } from '../../shared/models/types';
export declare class NoteRepository {
    private storageDir;
    private notesFile;
    private notes;
    constructor();
    private initStorage;
    private loadNotes;
    private saveNotes;
    getAllNotes(): Promise<NoteModel[]>;
    getNoteById(id: string): Promise<NoteModel | undefined>;
    createNote(note: Omit<NoteModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<NoteModel>;
    updateNote(id: string, updateData: Partial<Omit<NoteModel, 'id' | 'createdAt' | 'updatedAt'>>): Promise<NoteModel | undefined>;
    deleteNote(id: string): Promise<boolean>;
    searchNotes(searchTerm?: string, tags?: string[], skip?: number, take?: number): Promise<{
        notes: NoteModel[];
        total: number;
    }>;
    getAllTags(): Promise<string[]>;
    importNotes(notesData: string): Promise<number>;
    exportNotes(format: 'json' | 'markdown'): Promise<string>;
}
