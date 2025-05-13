"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagsHandler = getTagsHandler;
function getTagsHandler(repository) {
    return async (query) => {
        try {
            const tags = await repository.getAllTags();
            return {
                tags,
            };
        }
        catch (error) {
            console.error('Error getting tags:', error);
            return {
                tags: [],
            };
        }
    };
}
