const helpers = require('./helpers')
const textParser = require('./text-parser')
const attributeReactiveCompiler= require('./attribute-reactive-compiler')

class AttributesCompiler {

  compile (elementName, attributes) {
    return helpers.rewrite(Object.keys(attributes).map((a)=>{

      let parsed = textParser.parse(attributes[a])
      if(!parsed)
        return `${elementName}.setAttribute('${a}',\`${attributes[a]}\`);`

      return `
        var val = ${parsed.template()};
        if(val) {
          ${elementName}.setAttribute('${a}', val);
        }
        ${attributeReactiveCompiler.compile(elementName, a, parsed)}
      `
    }).join(''))
  }
}

module.exports = new AttributesCompiler()
