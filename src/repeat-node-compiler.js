const helpers = require('./helpers')
const textParser = require('./text-parser')
const tagNodeCompiler = require('./tag-node-compiler.js')
const repeatNodeUpdateCompiler = require('./repeat-node-update-compiler.js')

class RepeatNodeCompiler {

  compile (parentName, node, childrenCompiler) {
    let elName = `${parentName}_el`
    let parsed = textParser.parse(node.attribs['repeat-for'])
    let as = node.attribs['repeat-as'] || 'items'
    let index = node.attribs['repeat-index'] || 'i'
    delete node.attribs['repeat-for'] 
    delete node.attribs['repeat-as'] 
    delete node.attribs['repeat-index'] 
    return helpers.rewrite(helpers.closure(
    `
      let _nodes = []
      let ${as} = ${parsed.value()} || []
      let _createChildren = (${index}) => {
        node = ${tagNodeCompiler.compile(parentName, node, childrenCompiler)}
        _nodes.push(node)
      }
      ${repeatNodeUpdateCompiler.compile(parentName, node, parsed, as, index)}
      for(let ${index} = 0; ${index} < ${as}.length; ${index}++) {
        _createChildren(${index})
      } 
    `)) 
  }
}

module.exports =  new RepeatNodeCompiler()