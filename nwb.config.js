module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactFullyScrolled',
      externals: {
        react: 'React'
      }
    }
  }
}
