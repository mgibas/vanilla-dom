const helpers = require('./helpers')
const textParser = require('./text-parser')
const attributeUpdateCompiler= require('./attribute-update-compiler')

class AttributesCompiler {

  compile (elementName, attributes, options) {
    return helpers.rewrite(Object.keys(attributes).map((a)=>{
      if(a.startsWith('on-'))
        return `${elementName}.addEventListener('${a.replace('on-','')}', ${attributes[a]}.bind(this));`

      let parsed = textParser.parse(attributes[a], options)
      if(!parsed)
        return `${elementName}.setAttribute('${a}',\`${attributes[a]}\`);`

      return helpers.closure(`
        let val = ${parsed.value()};
        if(val === null || val === undefined) val = ${parsed.template()};
        if(typeof val === 'boolean' && val)
          ${elementName}.setAttribute('${a}', '');
        if((val && typeof val === 'string') || typeof val === 'number') {
          ${attributeUpdateCompiler.compileSetAttribute(a, elementName)}
        }
        ${attributeUpdateCompiler.compile(elementName, a, parsed, options)}
      `)
    }).join(''))
  }
}

module.exports = new AttributesCompiler()
