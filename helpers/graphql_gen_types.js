const __parse = function(data, first) {
  if (typeof data === 'string') return data;

  return (first ? '' : '{') + Object.keys(data).map(name => {
    return (first ? 'type ' : ' ') + name + (first ? ' ' : ': ') + __parse(data[name], false)
  }).join(first ? ' ' : ', ') + (first ? ' ' : '}');
};

module.exports = {
  name: 'resolveSchema',
  group: 'GraphqlHelper',
  handle(state, data) {
    data.models = __parse(data.models, true);
    return data;
  }
};
