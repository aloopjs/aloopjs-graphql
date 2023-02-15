const fs = require('fs');
const path = require('path');
const { modules } = App.options;

module.exports = (request) => {
  let schema = {};

  function add(dir, file) {
    schema[sc.name] = schema[sc.name] || {
      models: {
        Query: {}
      },
      data: {}
    };

    let sc = require(path.join(dir, file));
    let models = sc.models({ schema, request });
    let data = sc.data({ schema, request });

    schema[sc.name] = {
      models: {
        ...schema[sc.name].models,
        ...models,
        Query: {
          ...schema[sc.name].models.Query,
          ...(models.Query || {})
        }
      },
      data: {
        ...schema[sc.name].data,
        ...data
      }
    };
  }

  modules.forEach((el) => {
    let root = App.base.modulePath(el, 'graphql');

    if (fs.existsSync(root)) {
      fs
        .readdirSync(root)
        .filter(file => {
          return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
          add(root, file);
        });
    }
  });

  return schema;
};