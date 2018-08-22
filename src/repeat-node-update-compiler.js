const helpers = require('./helpers')
const tagNodeCompiler = require('./tag-node-compiler.js')

class RepeatNodeUpdateCompiler {

  compile (parentName, node, parsed, options) {
    return helpers.rewrite(`
      _updaters.push({ 
        update: (${options.state}) => { 
          let prevCount = ${options.as}.length
          ${options.as} = ${parsed.value()}; 
          for(let __removeIndex = prevCount - 1; __removeIndex >= ${options.as}.length; __removeIndex--) {
            ${parentName}.removeChild(_nodes[__removeIndex].node);
          } 
          if(prevCount > ${options.as}.length)
            _nodes.length = ${options.as}.length

          for(let __index = 0; __index < _nodes.length; __index++) {
            for(let __updatersIndex = 0; __updatersIndex < _nodes[__index].updaters.length; __updatersIndex++) {
               _nodes[__index].updaters[__updatersIndex].update(${options.state})
            }
          }

          _nodes.length = ${options.as}.length

          for(let ${options.index} = prevCount; ${options.index} < ${options.as}.length; ${options.index}++) {
            _createChildren(${options.index})
          } 
        } 
      });
      `)
  }
}

module.exports =  new RepeatNodeUpdateCompiler()
