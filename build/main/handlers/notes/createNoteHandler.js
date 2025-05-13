"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNoteHandler = createNoteHandler;
function createNoteHandler(repository) {
    return async (command) => {
        try {
            const { title, content, tags = [] } = command.payload;
            const newNote = await repository.createNote({
                title,
                content,
                tags,
            });
            return {
                success: true,
                noteId: newNote.id,
            };
        }
        catch (error) {
            console.error('Error creating note:', error);
            return {
                success: false,
                noteId: '',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    };
}
