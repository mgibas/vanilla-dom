const helpers = require('./helpers')
const textParser = require('./text-parser')
const textNodeReactiveCompiler = require('./text-node-reactive-compiler')

class TextNodeCompiler {

  compile (parentName, node) {
    let parsed = textParser.parse(node.data)
     
    let mount = `
      let textNode = document.createTextNode(${parsed ? parsed.template() : '`' + node.data + '`'})
      ${parentName}.appendChild(textNode)
    `
    if(!parsed)
      return helpers.rewrite(helpers.closure(mount))
    return helpers.rewrite(helpers.closure(`
      ${mount}
      ${textNodeReactiveCompiler.compile('textNode', parsed)} 
    `))
  }
}

module.exports =  new TextNodeCompiler()
