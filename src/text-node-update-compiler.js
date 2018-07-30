const helpers = require('./helpers')

class TextNodeUpdateCompiler {
  compile (elementName, parsed, options) {
    return helpers.rewrite(parsed.paths.map((path) => `
      _reactivePaths['${path}'] = _reactivePaths['${path}'] || [];
      _reactivePaths['${path}'].push({ 
        update: (${options.state}) => {${elementName}.nodeValue = ${parsed.template()}}
      });
      `).join(''))
  }
}

module.exports =  new TextNodeUpdateCompiler()
