module.exports = {
  name: 'middleware',
  group: 'GraphqlHelper',
  handle: function(state, data){
    return (req, res, next) => {
      let compact = require('../compact')(req);
      let middleware = {};

      for (let i = 0; i < req.body.length; i++) {
        if (compact[req.body[i].schema]) {
          middleware = {
            ...middleware,
            ...compact[req.body[i].schema].middleware
          };
        }
      }

      let ls = Object.keys(middleware);

      /** Navigate to next if middleware is not applied */
      if (ls.length === 0) {
        return next();
      }

      let index = -1;

      const __next = function () {
        index++;

        if (!ls[index]) {
          return next();
        }

        return middleware[ls[index]](req, res, __next);
      };

      return __next();
    };
  }
};
