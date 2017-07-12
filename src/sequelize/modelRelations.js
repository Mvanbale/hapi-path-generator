"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const R = require("ramda");
const modelIdentifiers_1 = require("./modelIdentifiers");
/**
 *  Returns an array with the name of the tables related with the model provided
 *  @param {sequelizeModel} model
 *  @returns {array} List of related tables.
 */
function relationExtractor(model) {
    let keys = Object.keys(model.tableAttributes);
    function modelReducer(acc, key) {
        if (!R.isNil(model.tableAttributes[key].references)) {
            acc.push(model.tableAttributes[key].references.model);
            // references.model here is the name of the table
        }
        return acc;
    }
    return R.reduce(modelReducer, [], keys);
}
exports.relationExtractor = relationExtractor;
;
/**
 *  Creates a representation of the relations between the models
 *  {
 *    'tableName1': {
 *      'tableName2': 'own' (Table1 one holds the key that relates to table2)
 *    },
 *    'tableName2': {
 *      'tableName1': 'external' (Table1 one holds the key that relates to table2)
 *    }
 *  }
 *  @param {Sequelize} sequelize
 *  @returns {object} The representation of the relations.
 */
function modelRelationTree(sequelize) {
    let globalRelations = {};
    Object.keys(sequelize.models).forEach((modelName) => {
        let model = sequelize.models[modelName];
        if (!globalRelations[model.tableName]) {
            globalRelations[model.tableName] = {
                model: model.name,
                identifiers: modelIdentifiers_1.default(model),
                relations: {}
            };
        }
        else {
            globalRelations[model.tableName].model = model.name;
            globalRelations[model.tableName].identifiers = modelIdentifiers_1.default(model);
        }
        let relations = relationExtractor(model);
        let own = {};
        relations.forEach((relation) => {
            own[relation] = 'one';
        });
        globalRelations[model.tableName].relations = R.merge(globalRelations[model.tableName].relations, own);
        relations.forEach((tableName) => {
            if (!globalRelations[tableName]) {
                globalRelations[tableName] = {
                    model: null,
                    identifiers: {},
                    relations: {
                        [model.tableName]: 'many'
                    }
                };
            }
            else {
                globalRelations[tableName].relations[model.tableName] = 'many';
            }
        });
    });
    return globalRelations;
}
exports.default = modelRelationTree;
;
