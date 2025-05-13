"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNoteHandler = updateNoteHandler;
function updateNoteHandler(repository) {
    return async (command) => {
        try {
            const { id, title, content, tags } = command.payload;
            const updatedNote = await repository.updateNote(id, {
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
        }
        catch (error) {
            console.error('Error updating note:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    };
}
