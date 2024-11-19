/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
   testEnvironment: "node",
   transform: {
      "^.+.tsx?$": ["ts-jest", {}],
   },
   transformIgnorePatterns: [
      "node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"
   ],
   preset: "ts-jest"
};