const helpers = require('./helpers')

class AttributeUpdateCompiler {
  compile (elementName, attribute, parsed, options) {
    return helpers.rewrite( `
        _updaters.push({ 
          update: (${options.state}) => { 
            let val = ${parsed.value()};
            if(val === null || val === undefined) val = ${parsed.template()};
            
            let currentVal = ${elementName}.getAttribute('${attribute}')
            if(typeof val === 'boolean' && val) {
              if(currentVal !== '') ${elementName}.setAttribute('${attribute}', '');
              return
            }
            if((val && typeof val === 'string') || typeof val === 'number') {
              if(currentVal !== val) ${elementName}.setAttribute('${attribute}', val);
              return
            }
            ${elementName}.removeAttribute('${attribute}')
          }
        })
      `)
  }
}

module.exports = new AttributeUpdateCompiler()
