'use strict';

const R = require('ramda');

module.exports = function pathGenerator(modelRelations) {
  return R.flatten(Object.keys(modelRelations).map((model) => {
    return tableGenerator({}, model, modelRelations);
  }));
};

const tableGenerator = module.exports.tableGenerator = function tableGenerator(state, table, schema) {

  let history = R.clone(state.history || []);

  if(R.contains(table, history.map((entry) => {return entry.table; }))) {
    return [];
  }
  else {
    let useRoot = history.length > 0 ? 'methods' : 'rootMethods';

    history.unshift({
      type: 'table',
      table: table,
      model: schema[table].model
    });

    let newPath = `${state.path || ''}/${table}`;
    let newState = {
      path: newPath,
      history: history
    };

    let rows = rowGenerator(newState, table, schema);

    return R.concat(scopes.table[useRoot].map((method) => {
      return {
        path: newPath,
        method: method,
        history: history
      };
    }), rows);
  }
};

const rowGenerator = module.exports.rowGenerator = function rowGenerator(state, table, schema) {

  let history = R.clone(state.history || []);
  let head = R.head(history);

  let relation = schema[table].relations[head && head.table];
  let relationType = head && head.type;
  let identifier = `${schema[table].model}_id`;
  if(relation) {
    history.unshift({
      type: 'row',
      table: table,
      model: schema[table].model
    });
  }
  else {
    history[0] = {
      type: 'row',
      table: table,
      model: schema[table].model,
      identifier: identifier
    };
  }


  let newPath = relation ? `${state.path}/${schema[table].model}` :  `${state.path}/{${identifier}}`;

  let newState = {
    path: newPath,
    history: history
  };

  let tables = R.flatten(Object.keys(schema[table].relations).map((relation) => {
    if(schema[table].relations[relation] == 'one') {
      return rowGenerator(newState, relation, schema);
    }
    else {
      return tableGenerator(newState, relation, schema);
    }
  }));

  return R.concat(scopes.row.methods.map((method) => {
    return {
      path: newPath,
      method: method,
      history: history
    };
  }), tables);
};


const scopes = module.exports.scopes = {
  row: {
    name: 'row',
    methods: ['get', 'put', 'delete']
  },
  table: {
    name: 'table',
    rootMethods: ['get', 'post', 'delete'],
    methods: ['get', 'delete']
  }
};
