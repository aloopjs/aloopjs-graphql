let { graphql, buildSchema } = require('graphql');
const { GraphQL } = App.services();

module.exports = {
  register() { },
  async boot({ app, type }) {
    if (type !== 'express') return;

    let router = require('express').Router();
    let middleware = await GraphQL.middleware();

    router.post('/graphql', middleware, async (req, res) => {
      let compact = require('./compact')(req);
      let result = {};
      let response = await GraphQL.response(res);

      if (!(req.body instanceof Array)) {
        return response(422, { message: 'Bad request' });
      }

      for (let i = 0; i < req.body.length; i++) {
        if (!compact[req.body[i].schema]) {
          return response(422, { message: `Schema ${req.body[i].schema} not exists` });
        }
      }

      for (let i = 0; i < req.body.length; i++) {
        let parse = await GraphQL.resolveSchema(compact[req.body[i].schema]);
        let grres = await graphql({
          schema: buildSchema(parse.models),
          rootValue: parse.data,
          source: req.body[i].query
        });

        if (grres.errors) {
          return response(422, { schema: req.body[i].schema, errors: grres.errors });
        }

        result[req.body[i].schema] = grres.data;
      }

      return response(200, result);
    });

    app.use(router);
  }
};
