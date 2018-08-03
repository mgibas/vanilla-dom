const helpers = require('./helpers')

class AttributeUpdateCompiler {
  compile (elementName, attribute, parsed, options) {
    return helpers.rewrite( `
        _updaters.push({ 
          update: (${options.state}) => { ${elementName}.setAttribute('${attribute}',${parsed.template()})}
        });
      `)
  }
}

module.exports = new AttributeUpdateCompiler()
