const helpers = require('./helpers')
const htmlparser = require('htmlparser2')
const tagNodeCompiler = require('./tag-node-compiler.js')
const textNodeCompiler = require('./text-node-compiler.js')

class Compiler {
  compile (source, options) {
    let dom = htmlparser.parseDOM(source) 

    let compiled = `
      let mount = (domRoot, state) => {
        const _reactivePaths = [];

        ${dom.map((d) => {
          return this.compileNode('domRoot', d)
        }).join('')}    
        
        return (state) => {
          Object.keys(_reactivePaths).forEach((key) => {
            _reactivePaths[key].forEach((react) =>{
              if(react.type === 'attribute') {
                react.element.setAttribute(react.attribute,react.templateFunc(state))
              }
              if(react.type === 'text') {
                react.element.nodeValue = react.templateFunc(state)
              }
            })
          })
        }
      }
    ` 
    if(options && options.module === 'closure') {
      return helpers.rewrite(helpers.closure(`${compiled} return mount`))
    }
    if(options && options.module === 'commonjs') {
      return helpers.rewrite(`${compiled} module.exports = mount`)
    }
    return helpers.rewrite(`
      ${compiled} 
      export default mount
    `)
  }
  compileNode(parentName, node) {
    if(node.type === 'tag')
      return tagNodeCompiler.compile(parentName, node, this.compileNode.bind(this))
    else
      return textNodeCompiler.compile(parentName, node)
  }
}

module.exports =  new Compiler()
