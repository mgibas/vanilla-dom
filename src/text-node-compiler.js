const helpers = require('./helpers')
const expressionsParser = require('./expressions-parser')
const textNodeReactiveCompiler = require('./text-node-reactive-compiler')

class TextNodeCompiler {

  compile (parentName, node) {
    let expression = expressionsParser.parse(node.data)
     
    let mount = `
      let textNode = document.createTextNode(${expression ? expression.template : '`' + node.data + '`'})
      ${parentName}.appendChild(textNode)
    `
    if(!expression)
      return helpers.rewrite(helpers.closure(mount))
    return helpers.rewrite(helpers.closure(`
      ${mount}
      ${textNodeReactiveCompiler.compile('textNode', expression)} 
    `))
  }
}

module.exports =  new TextNodeCompiler()
