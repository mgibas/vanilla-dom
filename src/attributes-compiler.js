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
        return result += this.compileSetAttribute(current.attribute, elementName, '"' + current.value + '"')
      }, '')
    
    result.events = preparedAttrs.filter((a) => !a.parsed && a.attribute.startsWith('on-'))
      .reduce((result, current) => {
        return result += `${elementName}.${current.attribute.replace('on-','on')} = ${current.value}.bind(this);`
      }, '')

    if(preparedAttrs.filter((a) => a.parsed).length > 0) {
      let valVar = `${elementName}AttribTmpVal`
      let currValVar = `${elementName}CurAttribTmpVal`
      result.updates = `
        var ${valVar}
        var ${currValVar}
      `
      result.updates += preparedAttrs.filter((a) => a.parsed)
        .reduce((result, current) => {
          return result += `
            ${valVar} = ${current.parsed.value()};
            if(${valVar} === null || ${valVar} === undefined) ${valVar} = ${current.parsed.template()};

            ${currValVar} = ${elementName}.getAttribute('${current.attribute}')
            if(typeof ${valVar} === 'boolean' && ${valVar}) {
              if(${currValVar} !== '') ${elementName}.setAttribute('${current.attribute}', '');
            }
            else if((${valVar} && typeof ${valVar} === 'string') || typeof ${valVar} === 'number') {
              if(${currValVar} != ${valVar}) {
                ${this.compileSetAttribute(current.attribute, elementName, valVar)} 
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
  compileSetAttribute(attribute, elementName, value) {
    if(attribute === 'class')
      return `${elementName}.className = ${value};`
    else 
      return `${elementName}.setAttribute('${attribute}', ${value});` 
  } 
}

module.exports = new AttributesCompiler()
