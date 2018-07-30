const helpers = require('./helpers')
const tagNodeCompiler = require('./tag-node-compiler.js')

class RepeatNodeUpdateCompiler {

  compile (parentName, node, parsed, options) {
    return helpers.rewrite(parsed.paths.map((path) => `
      _reactivePaths['${path}'] = _reactivePaths['${path}'] || [];
      _reactivePaths['${path}'].push({ 
        update: (${options.state}) => { 
          let prevCount = ${options.as}.length
          ${options.as} = ${parsed.value()}; 
          for(let ${options.index}  = ${options.as}.length; ${options.index} < prevCount; ${options.index}++) {
            ${this._compileRemoveNode(parentName)}
          } 
          for(let ${options.index} = prevCount; ${options.index} < ${options.as}.length; ${options.index}++) {
            _createChildren(${options.index})
          } 
        } 
      });
      `).join(''))
  }
  _compileRemoveNode(parentName) {
    return `
      let toRemove = _nodes.pop()
      ${parentName}.removeChild(toRemove);
    `
  }
}

module.exports =  new RepeatNodeUpdateCompiler()
