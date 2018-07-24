const helpers = require('./helpers')

class AttributeReactiveCompiler {
  compile (elementName, attribute, parsed) {
    return helpers.rewrite(parsed.paths.map((path) => `
        _reactivePaths['${path}'] = _reactivePaths['${path}'] || [];
        _reactivePaths['${path}'].push({ 
          type: 'attribute',
          element: ${elementName},
          attribute: '${attribute}',
          template: (state) => ${parsed.template()}
        });
      `).join(''))
  }
}

module.exports = new AttributeReactiveCompiler()
