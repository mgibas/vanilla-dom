const helpers = require('./helpers')

class TextNodeUpdateCompiler {
  compile (elementName, parsed, options) {
    return helpers.rewrite(`
      _updaters.push({ 
        update: (${options.state}) => {${elementName}.nodeValue = ${parsed.template()}}
      });
      `)
  }
}

module.exports =  new TextNodeUpdateCompiler()
