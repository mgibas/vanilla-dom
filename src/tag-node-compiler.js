const helpers = require('./helpers')
const attributesCompiler = require('./attributes-compiler.js')

class TagNodeCompiler {

  compile (node, nodeName, parentName, index, compiler, options) {
    let cloneName = `${nodeName}_clone`
    let attributes = attributesCompiler.compile(nodeName, node.attribs, options) 
    let cloneAttributes = attributesCompiler.compile(cloneName, node.attribs, options) 
    let children = [].concat.apply([], node.children.map((n, index) => compiler(nodeName, n, options, index)))
    return [{
      name: nodeName,
      def: `var ${nodeName} = document.createElement('${node.name}');`,
      cloneDef: `var ${cloneName} = ${parentName}_clone.childNodes[${index}];`,
      mount: `${parentName}.appendChild(${nodeName});`,
      events: attributes.events,
      cloneEvents: cloneAttributes.events,
      statics: attributes.statics,
      cloneStatics: cloneAttributes.statics,
      update: attributes.updates,
      cloneUpdate: cloneAttributes.updates
    }, ...children]
  }
}

module.exports =  new TagNodeCompiler()
