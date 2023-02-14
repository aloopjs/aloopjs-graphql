
module.exports = {
	name: 'Test',

	models({ schema, request }) {
		return {
			Item: {
				name: 'String!'
			},
			Query: {
				items: '[Item]'
			}
		};
	},

	data: ({ schema, request }) => {
		return {
			items(parent) {
				return [
					{ name: 'Item 1' },
					{ name: 'Item 2' }
				];
			}
		}
	}
};
