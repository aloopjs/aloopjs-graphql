
module.exports = {
  name: 'Test',

  typeDefs({schema, request}){
    return `
			type Item{
				name: String!
			}

			type Query{
				items: [Item]
			}
		`;
  },

	resolvers: ({schema, request}) => {
		return {
			Query: {
				items(parent) {
					return [
						{name: 'Item 1'},
						{name: 'Item 2'}
					]
				}
			}
		}
	}
};
