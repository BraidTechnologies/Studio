"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultModel = getDefaultModel;
exports.getModel = getModel;
const Model_1 = require("./Model");
/**
 * Returns the default model which is an instance of GPT4oMini.
 * @returns {IModel} The default model.
 */
function getDefaultModel() {
    return new Model_1.GPTMini();
}
/**
 * Returns an instance of IModel based on the provided EModel type.
 *
 * @param model - The EModel type to determine the model.
 * @returns An instance of IModel corresponding to the specified EModel type.
 */
function getModel(model) {
    switch (model) {
        default:
            return new Model_1.GPTMini();
    }
}
//# sourceMappingURL=IModelFactory.js.map