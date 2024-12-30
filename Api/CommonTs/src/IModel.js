"use strict";
/**
 * @module IModel
 * @description Defines the core model interfaces and enums used for AI model management.
 * Contains the model size enumeration and the base interface for model implementations,
 * including deployment configuration and text processing capabilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EModel = void 0;
// Copyright (c) 2024 Braid Technologies Ltd
/**
 * Enum representing different sizes of a model.
 *
 * @enum {string}
 */
var EModel;
(function (EModel) {
    EModel["kSmall"] = "Small";
    EModel["kLarge"] = "Large";
})(EModel || (exports.EModel = EModel = {}));
;
//# sourceMappingURL=IModel.js.map