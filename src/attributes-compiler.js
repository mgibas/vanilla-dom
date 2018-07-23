const helpers = require('./helpers')
const expressionsParser = require('./expressions-parser')
const attributeReactiveCompiler= require('./attribute-reactive-compiler')

class AttributesCompiler {

  compile (elementName, attributes) {
    return helpers.rewrite(Object.keys(attributes).map((a)=>{

      let expression = expressionsParser.parse(attributes[a])
      if(!expression)
        return `${elementName}.setAttribute('${a}',\`${attributes[a]}\`);`

      return `
        var val = ${expression.template};
        if(val) {
          ${elementName}.setAttribute('${a}', val);
        }
        ${attributeReactiveCompiler.compile(elementName, a, expression)}
      `
    }).join(''))
  }
}

module.exports = new AttributesCompiler()
