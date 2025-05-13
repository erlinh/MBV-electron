"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotesHandler = getNotesHandler;
function getNotesHandler(repository) {
    return async (query) => {
        try {
            const { searchTerm, tags, skip, take } = query.payload;
            const result = await repository.searchNotes(searchTerm, tags, skip, take);
            return {
                notes: result.notes,
                total: result.total,
            };
        }
        catch (error) {
            console.error('Error getting notes:', error);
            return {
                notes: [],
                total: 0,
            };
        }
    };
}
