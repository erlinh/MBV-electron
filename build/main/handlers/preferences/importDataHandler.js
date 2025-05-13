"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importDataHandler = importDataHandler;
function importDataHandler(repository) {
    return async (command) => {
        try {
            const { data } = command.payload;
            const count = await repository.importNotes(data);
            return {
                success: true,
                count,
            };
        }
        catch (error) {
            console.error('Error importing data:', error);
            return {
                success: false,
                count: 0,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    };
}
