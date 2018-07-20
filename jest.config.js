module.exports = {
  "moduleFileExtensions": [
    "js",
    "vue"
  ],
  "transform": {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
  },
  "moduleNameMapper": {
    "\\.(css|scss|jpg|png|svg)$": "<rootDir>/empty-module.js",
    "~(.*)$": "<rootDir>/src/$1",
  },
  "snapshotSerializers": [
    "<rootDir>/node_modules/jest-serializer-vue",
  ],
};

