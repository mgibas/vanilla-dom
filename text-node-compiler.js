const expressionsParser = require('./expressions-parser')

class TextNodeCompiler {

  compile (parentName, node) {
    let expression = expressionsParser.parse(node.data)
    let value = expression ? expression.template : `\`${node.data}\`` 

    return `
      (() => {
        let tel = document.createTextNode(${value})
        ${parentName}.appendChild(tel)
        ${expression 
            ? expression.paths.map((path) => {
              return `reactivePaths['${path}'] = reactivePaths['${path}'] || [];
              reactivePaths['${path}'].push({ 
                type: 'text',
                element: tel,
                templateFunc: (state) => ${expression.template}
              });`
            }).join('')
            : ''}
      })();
    `
  }
}

module.exports =  new TextNodeCompiler()
