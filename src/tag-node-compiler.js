const helpers = require('./helpers')
const attributesCompiler = require('./attributes-compiler.js')

class TagNodeCompiler {

  compile (parentName, tagNode, childrenCompiler, options) {
    let elName = `${parentName}_el`
    return helpers.closure(`
      let ${elName} = document.createElement('${tagNode.name}');
      ${attributesCompiler.compile(elName, tagNode.attribs, options)}
      ${tagNode.children.map((child) => {
        return childrenCompiler(elName, child, options)
      }).join('')}    

      ${parentName}.appendChild(${elName});
      return ${elName};
    `)
  }
}

module.exports =  new TagNodeCompiler()
