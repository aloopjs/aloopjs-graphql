module.exports = {
  name: 'response',
  group: 'GraphqlHelper',
  replace: true,
  handle(state, res) {
    return (code, data) => {
      return res.status(code).json(data);
    }
  }
};
