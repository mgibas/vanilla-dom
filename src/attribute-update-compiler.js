const helpers = require('./helpers')

class AttributeUpdateCompiler {
  compile (elementName, attribute, parsed) {
    return helpers.rewrite(parsed.paths.map((path) => `
        _reactivePaths['${path}'] = _reactivePaths['${path}'] || [];
        _reactivePaths['${path}'].push({ 
          update: (state) => { ${elementName}.setAttribute('${attribute}',${parsed.template()})}
        });
      `).join(''))
  }
}

module.exports = new AttributeUpdateCompiler()
