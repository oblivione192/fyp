export default {
    transform: {
      '\\.m?jsx?$': 'jest-esm-transformer'
    },
    extensionsToTreatAsEsm: ['.js', '.jsx'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1'
    }
  };