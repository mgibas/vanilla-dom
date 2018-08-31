const helpers = require('./helpers')
const attributesCompiler = require('./attributes-compiler.js')

class TagNodeCompiler {

  compile (node, nodeName, parentName, index, compiler, options) {
    let attributes = attributesCompiler.compile(nodeName, node.attribs, options) 
    let children = [].concat.apply([], node.children.map((n, index) => compiler(nodeName, n, options, index)))
    return [{
      name: nodeName,
      def: `var ${nodeName} = document.createElement('${node.name}');`,
      cloneDef: `var ${nodeName}_clone = ${parentName}_clone.childNodes[${index}];`,
      mount: `${parentName}.appendChild(${nodeName});`,
      statics: attributes.statics,
      update: `${attributes.updates}`,
      cloneUpdate: `${attributesCompiler.compile(nodeName+'_clone',node.attribs, options).updates}`
    }, ...children]
  }
}

module.exports =  new TagNodeCompiler()
