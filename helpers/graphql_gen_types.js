module.exports = {
  name: 'genTypes',
  group: 'GraphqlHelper',
  parse(data, first) {
    if (typeof data === 'string') return data;

    return (first ? '' : '{') + Object.keys(data).map(name => {
      return (first ? 'type ' : ' ') + name + (first ? ' ' : ': ') + this.parse(data[name], false)
    }).join(' ') + (first ? ' ' : '}');
  },

  handle(state, data) {
    return this.parse(data, true);
  }
};
