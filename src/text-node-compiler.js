const helpers = require('./helpers')
const textParser = require('./text-parser')
const textNodeUpdateCompiler = require('./text-node-update-compiler')

class TextNodeCompiler {

  compile (parentName, node, options) {
    let parsed = textParser.parse(node.data, options)
     
    let mount = `
      let textNode = document.createTextNode(${parsed ? parsed.template() : '`' + node.data + '`'})
      ${parentName}.appendChild(textNode)
    `
    if(!parsed)
      return helpers.rewrite(helpers.closure(mount))
    return helpers.rewrite(helpers.closure(`
      ${mount}
      ${textNodeUpdateCompiler.compile('textNode', parsed, options)} 
    `))
  }
}

module.exports =  new TextNodeCompiler()
