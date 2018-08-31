const helpers = require('./helpers')
const textParser = require('./text-parser')

class TextNodeCompiler {

  compile (node, nodeName, parentName, index, options) {
    let parsed = textParser.parse(node.data, options)
    return {
      name: nodeName,
      def: parsed ? `var ${nodeName} = document.createTextNode('');` : `var ${nodeName} = document.createTextNode(\`${node.data}\`);`,
      cloneDef: `var ${nodeName}_clone = ${parentName}_clone.childNodes[${index}];`,
      mount: `${parentName}.appendChild(${nodeName});`,
      update: `${!parsed ? `` : `var val = ${parsed.template()}; if(${nodeName}.nodeValue !== val) ${nodeName}.nodeValue = val;`}`,
      cloneUpdate: `${!parsed ? `` : `var val = ${parsed.template()}; if(${nodeName}_clone.nodeValue !== val) ${nodeName}_clone.nodeValue = val;`}`
    }
  }
}

module.exports =  new TextNodeCompiler()
