"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNoteHandler = deleteNoteHandler;
function deleteNoteHandler(repository) {
    return async (command) => {
        try {
            const { id } = command.payload;
            const deleted = await repository.deleteNote(id);
            if (!deleted) {
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
            console.error('Error deleting note:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    };
}
