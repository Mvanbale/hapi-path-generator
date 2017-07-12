"use strict";
const R = require('ramda');
const modelRelations_1 = require('./modelRelations');
const pathGenerator_1 = require('../pathGenerator');
const httpQueryParser_1 = require('./httpQueryParser');
const sequelizeQueryGenerator = require('./queryGenerator');
const methodMap = module.exports.methodMap = {
    table: {
        get: 'findAll',
        post: 'create',
        delete: 'destroy'
    },
    row: {
        get: 'findOne',
        put: 'update',
        delete: 'destroy'
    }
};
function paths(sequelize, options) {
    let schema = modelRelations_1.default(sequelize);
    return pathGenerator_1.default(schema, options).map((route) => {
        let state = R.clone(route.history[route.history.length - 1]);
        let model = sequelize.models[state.model];
        let queryParser = httpQueryParser_1.default(schema, model);
        let queryGenerator = sequelizeQueryGenerator(sequelize, route.history);
        route.query = function (context) {
            // console.log(context);
            context.query = queryParser(context.query || {});
            context.method = route.method;
            if (route.method === 'get') {
                context.query.limit = context.query.limit || options.defaultLimit;
                if (context.query.limit > options.maxItems) {
                    context.query.limit = options.maxItems;
                }
            }
            let query = queryGenerator(context);
            let base;
            if (context.query.scope) {
                base = sequelize.models[state.model].scope(context.query.scope);
            }
            else {
                base = sequelize.models[state.model];
            }
            let f = base[methodMap[state.type][route.method]];
            let fParams = [query];
            if (R.contains(route.method, ['put', 'post', 'update'])) {
                fParams.unshift(context.payload);
            }
            return f.apply(base, fParams).then((response) => {
                if (route.method === 'put') {
                    let updated = response[1];
                    if (state.type === 'row') {
                        return updated.length === 0 ? null : updated[0];
                    }
                    else {
                        return updated;
                    }
                }
                if (route.method === 'delete') {
                    return { id: context.identifiers[state.identifier] };
                }
                else {
                    return response;
                }
            });
        };
        return route;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = paths;
;
