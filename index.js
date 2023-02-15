let { graphql, buildSchema } = require('graphql');
const { GraphqlHelper } = App.helpers();

module.exports = {
  register() { },
  async boot({ app, type }) {
    if (type !== 'express') return;

    let router = require('express').Router();
    let authMidd = await GraphqlHelper.auth();

    router.post('/graphql', authMidd, async (req, res) => {
      let compact = require('./compact')(req);
      let result = {};

      // Chec if
      if (!(req.body instanceof Array)) {
        return res.status(422).json({ message: 'Bad request' });
      }

      for (let i = 0; i < req.body.length; i++) {
        if (!compact[req.body[i].schema]) {
          return res.status(422).json({ message: `Schema ${req.body[i].schema} not exists` });
        }
      }

      for (let i = 0; i < req.body.length; i++) {
        let parse = await GraphqlHelper.resolveSchema(compact[req.body[i].schema]);
        let grres = await graphql({
          schema: buildSchema(parse.models),
          rootValue: parse.data,
          source: req.body[i].query
        });

        if (grres.errors) {
          return res.status(401).json({ schema: req.body[i].schema, errors: grres.errors });
        }

        result[req.body[i].schema] = grres.data;
      }

      return res.status(200).json(result);
    });

    app.use(router);
  }
};
