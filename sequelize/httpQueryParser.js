"use strict";
const R = require('ramda');
const urlQueryParser = module.exports.urlQueryParser = function (relationSchema, model, raw) {
    let query = {
        attributes: {},
        scope: null,
        pagination: {
            limit: 10
        }
    };
    if (raw.embed) {
        let models = {};
        if (Array.isArray(raw.embed)) {
            raw.embed.forEach((_model) => {
                models[_model] = true;
            });
        }
        else {
            models[raw.embed] = true;
        }
        query['embed'] = models;
    }
    Object.keys(raw).filter((key) => {
        return !R.isNil(model.tableAttributes[key]);
    })
        .forEach((key) => {
        query.attributes[key] = raw[key];
    });
    Object.keys(raw).filter((key) => {
        return !R.isNil(model.options.scopes[key]);
    })
        .forEach((key) => {
        query.scope = key;
    });
    let pagination = ['limit', 'offset', 'order'];
    pagination.filter((key) => {
        // throw raw[key];
        return !R.isNil(raw[key]);
    })
        .forEach((key) => {
        if (key === 'order' && !Array.isArray(raw[key])) {
            raw[key] = [raw[key]];
        }
        query.pagination[key] = raw[key];
    });
    return query;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = R.curry(function (relationSchema, model, query) {
    return urlQueryParser(relationSchema, model, query);
});
