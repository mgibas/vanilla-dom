const helpers = require('./helpers')
const htmlparser = require('htmlparser2')
const tagNodeCompiler = require('./tag-node-compiler.js')
const repeatNodeCompiler = require('./repeat-node-compiler.js')
const textNodeCompiler = require('./text-node-compiler.js')
const attributesCompiler = require('./attributes-compiler.js')
const textParser = require('./text-parser')

class Compiler {
  compile (source, options) {
    this.nodesCounter = 0;
    options = Object.assign({state: 'st', module: 'es6'}, options)

    let dom = htmlparser.parseDOM(source) 
    let compiledNodes = dom.reduce((results, node, index) => {
      results.push(...(this.compileNode('domRoot', node, options, index)))
      return results
    }, [])

    let compiled = `
      let mount = function (domRoot, ${options.state}) {
        var _nodes = new Array(${compiledNodes.length}) 

        ${compiledNodes.map((node) => node.def).join('\n')}    
        ${compiledNodes.map((node) => node.mount).join('\n')}    
        ${compiledNodes.map((node) => node.statics).join('\n')}    
        ${compiledNodes.map((node) => `${node.name}.__vupdate = (${options.state}) => {${node.update}}`).join('\n')}    
        ${compiledNodes.map((node, index) => `_nodes[${index}] = ${node.name};`).join('\n')}    

        for(var i = 0; i < _nodes.length; i++) { _nodes[i].__vupdate(${options.state}); }
        return (${options.state}) => {
          for(var i = 0; i < _nodes.length; i++) { _nodes[i].__vupdate(${options.state}); }
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
  compileNode(parentName, node, options, index) {
    let results = []
    let nodeName = this.getUniqueName()

    if(node.type === 'tag' && node.attribs['repeat-for']) {
      results.push(repeatNodeCompiler.compile(node, nodeName, parentName, index, this.compileNode.bind(this), options))
    }
    else if(node.type === 'tag'){
      results.push(...tagNodeCompiler.compile(node, nodeName, parentName, index, this.compileNode.bind(this), options))
    }
    else if(node.type === 'text') {
      results.push(textNodeCompiler.compile(node, nodeName, parentName, index, options))
    }
    return results
  }
  getUniqueName() {
    return `el_${this.nodesCounter++}` 
  }
}

module.exports =  new Compiler()
