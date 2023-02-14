const __parse = function(data, first) {
  if (typeof data === 'string') return data;

  return (first ? '' : '{') + Object.keys(data).map(name => {
    return (first ? 'type ' : ' ') + name + (first ? ' ' : ': ') + __parse(data[name], false)
  }).join(' ') + (first ? ' ' : '}');
};

module.exports = {
  name: 'resolveSchema',
  group: 'GraphqlHelper',
  handle(state, data) {
    return data.typeDefs = __parse(data.typeDefs, true);
  }
};
