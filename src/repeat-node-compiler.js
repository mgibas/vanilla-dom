const textParser = require('./text-parser')
const attributesCompiler = require('./attributes-compiler.js')

class RepeatNodeCompiler {

  compile (node, nodeName, parentName, index, compiler, options) {
    let templateVar = `${nodeName}_template`
    let templateCloneVar = `${templateVar}_clone`
    let nodesVar = `${nodeName}.__vnodes`
    let parsed = textParser.parse(node.attribs['repeat-for'], options)
    let repeatOptions = Object.assign({
      as: node.attribs['repeat-as'] || 'items', 
      index: node.attribs['repeat-index'] || 'i'
    }, options)
    delete node.attribs['repeat-for'] 
    delete node.attribs['repeat-as'] 
    delete node.attribs['repeat-index'] 
    let children = [].concat.apply([], node.children.map((n, index) => compiler(templateVar, n, options, index)))
    let attributes = attributesCompiler.compile(templateCloneVar, node.attribs, options) 

    return {
      name: nodeName,
      repeater: true,
      def: `
        var ${nodeName} = document.createComment('${nodeName}');
        var ${templateVar} = document.createElement('${node.name}');
        ${children.map((node) => {
          return node.def          
        }).join('\n')}    
      `,
      cloneDef: `var ${nodeName}_clone = ${parentName}_clone.childNodes[${index}];`,
      mount: `
        ${parentName}.appendChild(${nodeName})
        ${children.map((node) => node.mount).join('\n')}
      `,
      update: `
        ${nodesVar} = ${nodesVar} || [];
        let prevLength = ${nodesVar}.length;
        let ${repeatOptions.as} = ${parsed.value()} || []
        let lastNode = prevLength ? ${nodesVar}[prevLength-1] : ${nodeName};

        let createNode = (${repeatOptions.index}) => {
          var ${templateVar}_clone  = ${templateVar}.cloneNode(true);
          ${attributes.statics}
          ${children.map((node) => {
            return node.cloneDef + '\n' + node.cloneStatics          
          }).join('\n')}    

          ${templateVar}_clone.__vupdate = (${repeatOptions.state}) => {
            let ${repeatOptions.as} = ${parsed.value()} || []
            ${attributes.updates}
            ${children.map((node) => {
              return node.cloneUpdate 
            }).join('\n')}    
          }
          
          return ${templateVar}_clone;
        }
        for(let __removeIndex = prevLength - 1; __removeIndex >= ${repeatOptions.as}.length; __removeIndex--) {
          ${parentName}.removeChild(${nodesVar}[__removeIndex]);
        } 
        
        ${nodesVar}.length = ${repeatOptions.as}.length

        for(let ${repeatOptions.index} = prevLength; ${repeatOptions.index} < ${repeatOptions.as}.length; ${repeatOptions.index}++) {
          let newNode = createNode(${repeatOptions.index})
          lastNode.parentNode.insertBefore(newNode, lastNode.nextSibling);
          lastNode = newNode;
          ${nodesVar}[${repeatOptions.index}] = newNode;
        } 
        for(let ${repeatOptions.index} = 0; ${repeatOptions.index} < ${repeatOptions.as}.length; ${repeatOptions.index}++) {
          ${nodesVar}[${repeatOptions.index}].__vupdate(${repeatOptions.state})
        } 
      `,
      cloneUpdate: ``,
    }
  }
}

module.exports =  new RepeatNodeCompiler()
