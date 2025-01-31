"use strict";
// Copyright (c) 2024, 2025 Braid Technologies Ltd
/**
 * @module IStorable
 * @description Defines core interfaces and types for persistent storage functionality.
 *
 * This module provides the foundational types for object persistence across the application,
 * including:
 * - IStorable interface for objects that can be stored in the database
 * - EStorableApplicationIds enum for identifying different applications
 * - Query specification interfaces for database operations
 *
 * The module enables consistent storage patterns across different applications while
 * maintaining flexibility through application-specific extensions of the base interfaces.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EStorableApplicationIds = void 0;
/**
 * Enum representing application names
 *
 * @enum {string}
 */
var EStorableApplicationIds;
(function (EStorableApplicationIds) {
    EStorableApplicationIds["kBoxer"] = "Boxer";
    EStorableApplicationIds["kWaterfall"] = "Waterfall";
})(EStorableApplicationIds || (exports.EStorableApplicationIds = EStorableApplicationIds = {}));
;
//# sourceMappingURL=IStorable.js.map