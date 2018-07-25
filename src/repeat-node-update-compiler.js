const helpers = require('./helpers')
const tagNodeCompiler = require('./tag-node-compiler.js')

class RepeatNodeUpdateCompiler {

  compile (parentName, node, childrenCompiler, parsed, as, index) {
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
            ${this._compileCreateNode(parentName, node, childrenCompiler)}
          } 
        } 
      });
      `).join(''))
  }
  _compileCreateNode(parentName, node, childrenCompiler) {
    return `
      let newNode = ${childrenCompiler(parentName, node)} 
      _nodes.push(newNode)
    `
  }
  _compileRemoveNode(parentName) {
    return `
      let toRemove = _nodes.pop()
      ${parentName}.removeChild(toRemove);
    `
  }
}

module.exports =  new RepeatNodeUpdateCompiler()
