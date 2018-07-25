const helpers = require('./helpers')

class TextNodeUpdateCompiler {
  compile (elementName, parsed) {
    return helpers.rewrite(parsed.paths.map((path) => `
      _reactivePaths['${path}'] = _reactivePaths['${path}'] || [];
      _reactivePaths['${path}'].push({ 
        update: (state) => {${elementName}.nodeValue = ${parsed.template()}}
      });
      `).join(''))
  }
}

module.exports =  new TextNodeUpdateCompiler()
