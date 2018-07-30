const helpers = require('./helpers')
const textParser = require('./text-parser')
const attributeUpdateCompiler= require('./attribute-update-compiler')

class AttributesCompiler {

  compile (elementName, attributes, options) {
    return helpers.rewrite(Object.keys(attributes).map((a)=>{

      let parsed = textParser.parse(attributes[a], options)
      if(!parsed)
        return `${elementName}.setAttribute('${a}',\`${attributes[a]}\`);`

      return `
        var val = ${parsed.template()};
        if(val) {
          ${elementName}.setAttribute('${a}', val);
        }
        ${attributeUpdateCompiler.compile(elementName, a, parsed, options)}
      `
    }).join(''))
  }
}

module.exports = new AttributesCompiler()
