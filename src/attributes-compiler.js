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
  compileSetAttribute(attribute, elementName, valVar) {
    if(attribute === 'class')
      return `${elementName}.className = ${valVar};`
    else 
      return `${elementName}.setAttribute('${attribute}', ${valVar});` 
  } 
}

module.exports = new AttributesCompiler()
