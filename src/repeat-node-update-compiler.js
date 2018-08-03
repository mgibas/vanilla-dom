const helpers = require('./helpers')
const tagNodeCompiler = require('./tag-node-compiler.js')

class RepeatNodeUpdateCompiler {

  compile (parentName, node, parsed, options) {
    return helpers.rewrite(`
      _updaters.push({ 
        update: (${options.state}) => { 
          let prevCount = ${options.as}.length
          ${options.as} = ${parsed.value()}; 
          _nodes.forEach((node) => { node.updaters.forEach((u) => u.update(${options.state})) })

          for(let ${options.index}  = ${options.as}.length; ${options.index} < prevCount; ${options.index}++) {
            ${parentName}.removeChild(_nodes.pop().node);
          } 
          for(let ${options.index} = prevCount; ${options.index} < ${options.as}.length; ${options.index}++) {
            _createChildren(${options.index})
          } 
        } 
      });
      `)
  }
}

module.exports =  new RepeatNodeUpdateCompiler()
