module.exports = {
  name: 'auth',
  group: 'GraphqlHelper',
  handle: function(state, data){
    const { auth } = App.middleware();
    return auth ? auth : (req, res, next) => {next();};
  }
};
