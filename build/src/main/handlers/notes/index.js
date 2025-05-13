"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNoteHandlers = registerNoteHandlers;
const NoteRepository_1 = require("../../persistence/NoteRepository");
const createNoteHandler_1 = require("./createNoteHandler");
const updateNoteHandler_1 = require("./updateNoteHandler");
const deleteNoteHandler_1 = require("./deleteNoteHandler");
const addTagHandler_1 = require("./addTagHandler");
const getNotesHandler_1 = require("./getNotesHandler");
const getNoteByIdHandler_1 = require("./getNoteByIdHandler");
const getTagsHandler_1 = require("./getTagsHandler");
// Create a singleton repository
const noteRepository = new NoteRepository_1.NoteRepository();
function registerNoteHandlers(messageBus) {
    // Register command handlers
    messageBus.registerHandler('CreateNoteCommand', (0, createNoteHandler_1.createNoteHandler)(noteRepository));
    messageBus.registerHandler('UpdateNoteCommand', (0, updateNoteHandler_1.updateNoteHandler)(noteRepository));
    messageBus.registerHandler('DeleteNoteCommand', (0, deleteNoteHandler_1.deleteNoteHandler)(noteRepository));
    messageBus.registerHandler('AddTagCommand', (0, addTagHandler_1.addTagHandler)(noteRepository));
    // Register query handlers
    messageBus.registerHandler('GetNotesQuery', (0, getNotesHandler_1.getNotesHandler)(noteRepository));
    messageBus.registerHandler('GetNoteByIdQuery', (0, getNoteByIdHandler_1.getNoteByIdHandler)(noteRepository));
    messageBus.registerHandler('GetTagsQuery', (0, getTagsHandler_1.getTagsHandler)(noteRepository));
}
