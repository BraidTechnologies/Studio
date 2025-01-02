"use strict";
/**
 * @module IModelDriver
 *
 * This module defines the core interfaces and enums for model-driven conversations.
 * It provides the fundamental types used to structure conversations between users
 * and AI models, including role definitions and conversation formats.
 *
 * The module includes:
 * - EModelConversationRole: Enum for different conversation participant roles
 * - IModelConversationElement: Interface for individual conversation messages
 * - IModelConversationPrompt: Interface for complete conversation contexts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EModelConversationRole = void 0;
/**
 * Enum representing the roles in a conversation with a model.
 *
 * @enum {string} EModelConversationRole
 * @property {string} kSystem - System message role
 * @property {string} kAssistant - Assistant message role
 * @property {string} kUser - User message role
 */
var EModelConversationRole;
(function (EModelConversationRole) {
    EModelConversationRole["kSystem"] = "system";
    EModelConversationRole["kAssistant"] = "assistant";
    EModelConversationRole["kUser"] = "user";
})(EModelConversationRole || (exports.EModelConversationRole = EModelConversationRole = {}));
;
//# sourceMappingURL=IModelDriver.js.map