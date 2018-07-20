const compiler = require('./compiler.js')

module.exports = function(content) {
  let compiled = compiler.compile(content)
  console.log(compiled)
  return compiled
};
