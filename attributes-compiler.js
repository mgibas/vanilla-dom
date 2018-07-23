const expressionsParser = require('./expressions-parser')

class AttributesCompiler {

  compile (elementName, attributes) {
    return Object.keys(attributes).map((a)=>{
      let expression = expressionsParser.parse(attributes[a])
      if(!expression)
        return `${elementName}.setAttribute('${a}',\`${attributes[a]}\`);`
      let reactivitySetup = expression.paths.map((path) => {
        return `reactivePaths['${path}'] = reactivePaths['${path}'] || [];
        reactivePaths['${path}'].push({ 
          type: 'attribute',
          element: ${elementName},
          attribute: '${a}',
          templateFunc: (state) => ${expression.template}
        });`
      }).join('')
      return `
        ${elementName}.setAttribute('${a}', ${expression.template});
        ${reactivitySetup}
      `
    }).join('')
  }
}

module.exports = new AttributesCompiler()
