const helpers = require('./helpers')

class AttributeReactiveCompiler {
  compile (elementName, attribute, expression) {
    return helpers.rewrite(expression.paths.map((path) => `
        _reactivePaths['${path}'] = _reactivePaths['${path}'] || [];
        _reactivePaths['${path}'].push({ 
          type: 'attribute',
          element: ${elementName},
          attribute: '${attribute}',
          templateFunc: (state) => ${expression.template}
        });
      `).join(''))
  }
}

module.exports = new AttributeReactiveCompiler()
