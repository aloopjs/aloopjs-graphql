const fs = require('fs');
const path = require('path');
const { modules } = App.options;

module.exports = (request) => {
  let schema = {};

  function add(dir, file) {
    let sc = require(path.join(dir, file));
    let models = sc.models({ schema, request });
    let data = sc.data({ schema, request });
    let middleware = sc.middleware ? sc.middleware({schema, request }) : {};

    schema[sc.name] = schema[sc.name] || {
      models: {
        Query: {}
      },
      middleware: {},
      data: {}
    };

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
      },
      middleware: {
        ...schema[sc.name].middleware,
        ...middleware
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