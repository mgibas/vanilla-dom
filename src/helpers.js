const esprima = require('esprima')
const escodegen = require('escodegen')

module.exports = {
  rewrite: (source) => {
    try{
    syntax = esprima.parseModule(source, { raw: true, comment: true });
    return escodegen.generate(syntax, { indent: '  ' }); 
    }catch(err){console.log(err, source)}
  },
  closure: (source) => {
    return `(() => { ${source} })();`
  }
}  
