module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "jasmine": true,
    "node": true
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "prefer-arrow-callback": 0,
    "func-names": 0,
    "import/no-extraneous-dependencies": 0,
    "no-underscore-dangle": 0,
    "no-unused-expressions": 0,
    "no-use-before-define": 0,
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],


    "comma-dangle": ["error", "always-multiline"],
    "semi": "off",
    "curly": ["error", "multi-line"],
    "no-unused-vars": ["error", { "args": "none" }],
    "no-empty": ["error", { "allowEmptyCatch": true }],
    "object-shorthand": ["error", "consistent"],


    "react/sort-comp": 0,
    "react/require-extension": 0,

    // react
    "react/display-name": 0,
    "react/jsx-boolean-value": 1,
    "jsx-quotes": 1,
    "react/jsx-no-undef": 1,
    "react/jsx-sort-props": 0,
    "react/jsx-uses-react": 1,
    "react/jsx-uses-vars": 1,
    "react/no-did-mount-set-state": 1,
    "react/no-did-update-set-state": 1,
    "react/no-multi-comp": 0,
    "react/no-unknown-property": 1,
    "react/prop-types": 0,
    "react/react-in-jsx-scope": 1,
    "react/self-closing-comp": 1,
    "react/jsx-wrap-multilines": 1,
    "react/jsx-filename-extension": 0,

  },

  "ecmaFeatures": {
    "jsx": true
  },
};
