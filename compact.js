const fs = require('fs');
const path = require('path');
const basename = path.dirname(require.main.filename);
const { modules } = App.options;

module.exports = (request) => {
  let schema = {};

  function add(dir, file) {
    let sc = require(path.join(dir, file));
    schema[sc.name] = {
      typeDefs: sc.typeDefs({ schema, request }),
      resolvers: sc.resolvers({ schema, request })
    };
  }

  modules.forEach((el) => {
    let root = null;

    // Check if have #
    if (el.charAt(0) === '#') root = [basename, 'src', el.replace(/^#/, ''), 'graphql'].join(path.sep);
    else root = [basename, 'node_modules', el, 'graphql'].join(path.sep);


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