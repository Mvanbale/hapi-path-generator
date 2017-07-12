"use strict";
function modelScopes(model) {
    let scopes = {};
    Object.keys(model['options'].scopes).forEach(key => {
        scopes[key] = true;
    });
    return scopes;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = modelScopes;
