const compiler = require('./src/compiler.js')

module.exports = function(content) {
  let compiled = compiler.compile(content)
  return compiled
};
