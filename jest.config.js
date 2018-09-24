module.exports = {
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json'
		},
		'typeDefs': 'replace me'
	},
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'\\.(ts|tsx)$': 'ts-jest'
	},
	testMatch: [
		'**/test/**/*.test.(ts|js)'
	],
	testEnvironment: 'node'
}