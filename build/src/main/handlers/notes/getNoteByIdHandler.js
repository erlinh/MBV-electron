"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNoteByIdHandler = getNoteByIdHandler;
function getNoteByIdHandler(repository) {
    return async (query) => {
        try {
            const { id } = query.payload;
            const note = await repository.getNoteById(id);
            if (!note) {
                return {
                    error: `Note with id ${id} not found`,
                };
            }
            return {
                note,
            };
        }
        catch (error) {
            console.error('Error getting note by id:', error);
            return {
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    };
}
