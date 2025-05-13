"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportDataHandler = exportDataHandler;
function exportDataHandler(repository) {
    return async (command) => {
        try {
            const { format } = command.payload;
            const data = await repository.exportNotes(format);
            return {
                success: true,
                data,
            };
        }
        catch (error) {
            console.error('Error exporting data:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    };
}
