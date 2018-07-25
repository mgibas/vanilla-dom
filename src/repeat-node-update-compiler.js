const helpers = require('./helpers')
const tagNodeCompiler = require('./tag-node-compiler.js')

class RepeatNodeUpdateCompiler {

  compile (parentName, node, parsed, as, index) {
    return helpers.rewrite(parsed.paths.map((path) => `
      _reactivePaths['${path}'] = _reactivePaths['${path}'] || [];
      _reactivePaths['${path}'].push({ 
        update: (state) => { 
          let prevCount = ${as}.length
          ${as} = ${parsed.value()}; 
          for(let ${index}  = ${as}.length; ${index} < prevCount; ${index}++) {
            ${this._compileRemoveNode(parentName)}
          } 
          for(let ${index} = prevCount; ${index} < ${as}.length; ${index}++) {
            _createChildren(${index})
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
