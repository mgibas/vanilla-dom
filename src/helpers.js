const esprima = require('esprima')
const escodegen = require('escodegen')

module.exports = {
  rewrite: (source) => {
    syntax = esprima.parseModule(source, { raw: true, comment: true });
    return escodegen.generate(syntax, { indent: '  ' }); 
  },
  closure: (source) => {
    return `(() => { ${source} })();`
  }
}  
