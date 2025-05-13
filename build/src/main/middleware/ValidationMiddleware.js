"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationMiddleware = void 0;
class ValidationMiddleware {
    async process(message, next) {
        // Validate the message based on its type
        switch (message.type) {
            case 'CreateNoteCommand':
                this.validateCreateNoteCommand(message);
                break;
            case 'UpdatePreferencesCommand':
                this.validateUpdatePreferencesCommand(message);
                break;
            // Add more validation cases as needed
        }
        return next();
    }
    validateCreateNoteCommand(command) {
        const { title, content } = command.payload;
        if (!title || title.trim() === '') {
            throw new Error('Note title is required');
        }
        if (!content || content.trim() === '') {
            throw new Error('Note content is required');
        }
        if (title.length > 100) {
            throw new Error('Note title must be less than 100 characters');
        }
    }
    validateUpdatePreferencesCommand(command) {
        const { fontSize } = command.payload;
        if (fontSize !== undefined && (fontSize < 8 || fontSize > 32)) {
            throw new Error('Font size must be between 8 and 32');
        }
    }
}
exports.ValidationMiddleware = ValidationMiddleware;
