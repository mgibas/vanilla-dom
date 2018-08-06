const helpers = require('./helpers')

class AttributeUpdateCompiler {
  compile (elementName, attribute, parsed, options) {
    return helpers.rewrite( `
        _updaters.push({ 
          update: (${options.state}) => { 
            let val = ${parsed.value()};
            if(val === null || val === undefined) val = ${parsed.template()};

            if(typeof val === 'boolean' && val)
              return ${elementName}.setAttribute('${attribute}', '');
            if((val && typeof val === 'string') || typeof val === 'number') {
              return ${elementName}.setAttribute('${attribute}', val);
            }
            ${elementName}.removeAttribute('${attribute}')
          }
        })
      `)
  }
}

module.exports = new AttributeUpdateCompiler()
