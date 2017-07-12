"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function modelScopes(model) {
    let scopes = {};
    Object.keys(model['options'].scopes).forEach(key => {
        scopes[key] = true;
    });
    return scopes;
}
exports.default = modelScopes;
