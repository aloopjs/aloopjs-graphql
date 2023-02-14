const fs = require('fs');
const path = require('path');
const { modules } = App.options;

module.exports = (request) => {
  let schema = {};

  function add(dir, file) {
    let sc = require(path.join(dir, file));
    schema[sc.name] = {
      models: sc.models({ schema, request }),
      data: sc.data({ schema, request })
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