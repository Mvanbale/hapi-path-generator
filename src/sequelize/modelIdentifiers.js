"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function modelIdentifiers(model) {
    let identifiers = {};
    Object.keys(model['tableAttributes']).forEach((value) => {
        let definition = model['tableAttributes'][value];
        if (definition.primaryKey === true || definition.unique === true) {
            identifiers[definition.field] = definition.type.constructor.key;
        }
    });
    return identifiers;
}
exports.default = modelIdentifiers;
;
