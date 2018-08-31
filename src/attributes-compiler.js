const helpers = require('./helpers')
const textParser = require('./text-parser')

class AttributesCompiler {

  compile(elementName, attributes, options) {
    let preparedAttrs = Object.keys(attributes).map((attribute) => {
      return {
        attribute: attribute,
        value: attributes[attribute],
        parsed: textParser.parse(attributes[attribute], options)
      }
    })
    let result = {
      updates: ''
    }
    result.statics = preparedAttrs.filter((a) => !a.parsed)
      .reduce((result, current) => {
        if(current.attribute.startsWith('on-'))
          return result += `${elementName}.addEventListener('${current.attribute.replace('on-','')}', ${current.value}.bind(this));`
        return result += `${elementName}.setAttribute('${current.attribute}',\`${current.value}\`);`
      }, '')
    
    if(preparedAttrs.filter((a) => a.parsed).length > 0) {
      result.updates = `
        let val
        let currentVal
      `
      result.updates += preparedAttrs.filter((a) => a.parsed)
        .reduce((result, current) => {
          return result += `
            val = ${current.parsed.value()};
            if(val === null || val === undefined) val = ${current.parsed.template()};

            currentVal = ${elementName}.getAttribute('${current.attribute}')
            if(typeof val === 'boolean' && val) {
              if(currentVal !== '') ${elementName}.setAttribute('${current.attribute}', '');
            }
            else if((val && typeof val === 'string') || typeof val === 'number') {
              if(currentVal != val) {
                ${this.compileSetAttribute(current.attribute, elementName)} 
              }
            }
            else {
              ${elementName}.removeAttribute('${current.attribute}')
            }
          `
        }, '')
    }
    return result
  }
  compileSetAttribute(attribute, elementName) {
    if(attribute === 'class')
      return `${elementName}.className = val;`
    else 
      return `${elementName}.setAttribute('${attribute}', val);` 
  } 
}

module.exports = new AttributesCompiler()
