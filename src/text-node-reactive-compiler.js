const helpers = require('./helpers')

class TextNodeReactiveCompiler {
  compile (elementName, parsed) {
    return helpers.rewrite(parsed.paths.map((path) => `
      _reactivePaths['${path}'] = _reactivePaths['${path}'] || [];
      _reactivePaths['${path}'].push({ 
        type: 'text',
        element: ${elementName},
        template: (state) => ${parsed.template()}
      });
      `).join(''))
  }
}

module.exports =  new TextNodeReactiveCompiler()
