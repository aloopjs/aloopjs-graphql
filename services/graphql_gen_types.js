const __parse = function(data, first) {
  // Case is tring
  if (typeof data === 'string') return data;

  return (first ? '' : '{') + Object.keys(data).map(name => {
    // Case value is array
    if (data[name] instanceof Array) {
      let __name = name + '(' + Object.keys(data[name][0]).map((key) => {
        return key + ': ' + __parse(data[name][0][key], false);
      }).join(', ') + ')';
      return (first ? 'type ' : ' ') + __name + (first ? ' ' : ': ') + __parse(data[name][1], false)
    }

    return (first ? 'type ' : ' ') + name + (first ? ' ' : ': ') + __parse(data[name], false)
  }).join(first ? ' ' : ', ') + (first ? ' ' : '}');
};

module.exports = {
  name: 'resolveSchema',
  group: 'GraphQL',
  handle(state, data) {
    data.models = __parse(data.models, true);
    return data;
  }
};
