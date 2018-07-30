const helpers = require('./helpers')
const htmlparser = require('htmlparser2')
const tagNodeCompiler = require('./tag-node-compiler.js')
const repeatNodeCompiler = require('./repeat-node-compiler.js')
const textNodeCompiler = require('./text-node-compiler.js')

class Compiler {
  compile (source, options) {
    options = Object.assign({
      state: 'st',
      module: 'es6'
    }, options)
    let dom = htmlparser.parseDOM(source) 

    let compiled = `
      let mount = (domRoot, ${options.state}) => {
        const _reactivePaths = [];

        ${dom.map((d) => {
          return this.compileNode('domRoot', d, options)
        }).join('')}    
        
        return (${options.state}) => {
          Object.keys(_reactivePaths).forEach((key) => {
            _reactivePaths[key].forEach((updater) =>{
              updater.update(${options.state})
            })
          })
        }
      }
    ` 
    if(options.module === 'closure') {
      return helpers.rewrite(helpers.closure(`${compiled} return mount`))
    }
    if(options.module === 'commonjs') {
      return helpers.rewrite(`${compiled} module.exports = mount`)
    }
    return helpers.rewrite(`
      ${compiled} 
      export default mount
    `)
  }
  compileNode(parentName, node, options) {
    if(node.type === 'tag' && node.attribs['repeat-for'])
      return repeatNodeCompiler.compile(parentName, node, this.compileNode.bind(this), options)
    else if(node.type === 'tag')
      return tagNodeCompiler.compile(parentName, node, this.compileNode.bind(this), options)
    else
      return textNodeCompiler.compile(parentName, node, options)
  }
}

module.exports =  new Compiler()
