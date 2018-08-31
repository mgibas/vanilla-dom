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
        let attribsVal
        let attribsCurrentVal
      `
      result.updates += preparedAttrs.filter((a) => a.parsed)
        .reduce((result, current) => {
          return result += `
            attribsVal = ${current.parsed.value()};
            if(attribsVal === null || attribsVal === undefined) attribsVal = ${current.parsed.template()};

            attribsCurrentVal = ${elementName}.getAttribute('${current.attribute}')
            if(typeof attribsVal === 'boolean' && attribsVal) {
              if(attribsCurrentVal !== '') ${elementName}.setAttribute('${current.attribute}', '');
            }
            else if((attribsVal && typeof attribsVal === 'string') || typeof attribsVal === 'number') {
              if(attribsCurrentVal != attribsVal) {
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
      return `${elementName}.className = attribsVal;`
    else 
      return `${elementName}.setAttribute('${attribute}', attribsVal);` 
  } 
}

module.exports = new AttributesCompiler()
