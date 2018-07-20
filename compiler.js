const htmlparser = require('htmlparser2')
const tagNodeCompiler = require('./tag-node-compiler.js')
const textNodeCompiler = require('./text-node-compiler.js')

class Compiler {
  compile (source) {
    let dom = htmlparser.parseDOM(source) 
    console.log(dom) 
    return `export default (domRoot, state) => {
      ${dom.map((d) => {
        return this.compileNode('domRoot', d)
      }).join('')}    
    }` 
  }
  compileNode(parentName, node) {
    if(node.type === 'tag')
      return tagNodeCompiler.compile(parentName, node, this.compileNode.bind(this))
    else
      return textNodeCompiler.compile(parentName, node)
  }
}

module.exports =  new Compiler()
