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
            if(currentVal != val) {
              ${this.compileSetAttribute(attribute, elementName)} 
            }
            return
          }
          ${elementName}.removeAttribute('${attribute}')
        }
      })
    `)
  }
  compileSetAttribute(attribute, elementName) {
    if(attribute === 'class')
      return `${elementName}.className = val;`
    else 
      return `${elementName}.setAttribute('${attribute}', val);` 
  } 
}

module.exports = new AttributeUpdateCompiler()
