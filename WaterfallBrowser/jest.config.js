/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
   testEnvironment: "node",
   transform: {
      "^.+.tsx?$": ["ts-jest", {}],
      "^.+.ts?$": ["ts-jest", {}]
   },
   transformIgnorePatterns: [
      "node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic|(?!axios)|(?!axios-retry))"
   ],
   preset: "ts-jest"
};