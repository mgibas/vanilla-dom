const helpers = require('./helpers')

class TextNodeReactiveCompiler {
  compile (elementName, expression) {
    return helpers.rewrite(expression.paths.map((path) => `
      _reactivePaths['${path}'] = _reactivePaths['${path}'] || [];
      _reactivePaths['${path}'].push({ 
        type: 'text',
        element: ${elementName},
        templateFunc: (state) => ${expression.template}
      });
      `).join(''))
  }
}

module.exports =  new TextNodeReactiveCompiler()
