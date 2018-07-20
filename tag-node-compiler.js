const attributesCompiler = require('./attributes-compiler.js')

class TagNodeCompiler {

  compile (parentName, tagNode, childrenCompiler) {
    let elName = `${parentName}_el`
    return `
      (() => {
        let ${elName} = document.createElement('${tagNode.name}');
        ${attributesCompiler.compile(elName, tagNode.attribs)}
        ${tagNode.children.map((child) => {
          return childrenCompiler(elName, child)
        }).join('')}    

        ${parentName}.appendChild(${elName})
      })();
    `
  }
}

module.exports =  new TagNodeCompiler()
