const helpers = require('./helpers')
const textParser = require('./text-parser')
const tagNodeCompiler = require('./tag-node-compiler.js')
const repeatNodeUpdateCompiler = require('./repeat-node-update-compiler.js')

class RepeatNodeCompiler {

  compile (parentName, node, childrenCompiler, opt) {
    let elName = `${parentName}_el`
    let parsed = textParser.parse(node.attribs['repeat-for'], opt)
    let options = Object.assign({
      as: node.attribs['repeat-as'] || 'items', 
      index: node.attribs['repeat-index'] || 'i'
    }, opt)
    delete node.attribs['repeat-for'] 
    delete node.attribs['repeat-as'] 
    delete node.attribs['repeat-index'] 
    return helpers.rewrite(helpers.closure(
    `
      let _nodes = []
      let ${options.as} = ${parsed.value()} || []
      let _createChildren = (${options.index}) => {
        (() => {
          let _updaters = []
          let node = ${tagNodeCompiler.compile(parentName, node, childrenCompiler, opt)}
          _nodes.push({node: node, updaters: _updaters})
        })()
      }
      ${repeatNodeUpdateCompiler.compile(parentName, node, parsed, options)}
      for(let ${options.index} = 0; ${options.index} < ${options.as}.length; ${options.index}++) {
        _createChildren(${options.index})
      } 
    `)) 
  }
}

module.exports =  new RepeatNodeCompiler()
