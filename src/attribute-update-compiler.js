const helpers = require('./helpers')

class AttributeUpdateCompiler {
  compile (elementName, attribute, parsed, options) {
    return helpers.rewrite(parsed.paths.map((path) => `
        _reactivePaths['${path}'] = _reactivePaths['${path}'] || [];
        _reactivePaths['${path}'].push({ 
          update: (${options.state}) => { ${elementName}.setAttribute('${attribute}',${parsed.template()})}
        });
      `).join(''))
  }
}

module.exports = new AttributeUpdateCompiler()
