const htmlparser = require('htmlparser2')
const tagNodeCompiler = require('./tag-node-compiler.js')
const textNodeCompiler = require('./text-node-compiler.js')

class Compiler {
  compile (source, options) {
    let dom = htmlparser.parseDOM(source) 
    let compiled = `
      let mount = (domRoot, state) => {
        const reactivePaths = [];

        ${dom.map((d) => {
          return this.compileNode('domRoot', d)
        }).join('')}    
        
        return (state) => {
          Object.keys(reactivePaths).forEach((key) => {
            reactivePaths[key].forEach((react) =>{
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
      return `(()=> { ${compiled} return mount })()`
    }
    if(options && options.module === 'commonjs') {
      return `${compiled} module.exports = mount`
    }
    return `${compiled} export default mount`
  }
  compileNode(parentName, node) {
    if(node.type === 'tag')
      return tagNodeCompiler.compile(parentName, node, this.compileNode.bind(this))
    else
      return textNodeCompiler.compile(parentName, node)
  }
}

module.exports =  new Compiler()
