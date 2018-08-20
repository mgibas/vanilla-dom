const helpers = require('./helpers')

class TextNodeUpdateCompiler {
  compile (elementName, parsed, options) {
    return helpers.rewrite(`
      _updaters.push({ 
        update: (${options.state}) => {
          let val = ${parsed.template()}
          if(${elementName}.nodeValue !== val) ${elementName}.nodeValue = val
        }
      });
      `)
  }
}

module.exports =  new TextNodeUpdateCompiler()
