const esprima = require('esprima')

class ExpressionsParser {
  parse (source) {
    let expressionsMatch = source.match(/{([^}]+)}/gm)
    if(!expressionsMatch) return
    let result = {
      template: '`' + source + '`',
      paths: []
    }
    expressionsMatch
      .forEach((exp) => {
        let templatized = '`$' + exp + '`'
        let tokens = esprima.parse(templatized, { tokens: true, range: true }).tokens
        let paths = tokens
          .filter((t, i) => { 
            return t.type === 'Identifier' && (i >= tokens.length -1 || tokens[i+1].value !== '(')  
          })
          .map((t)=> t.value)
          .join('.')
          .split('state.')
          .filter((val) => val) 
          .map((path) => path[path.length-1] === '.' ? path.slice(0,-1) : path)

        result.template = result.template.replace(exp, this._safeExpression(exp))
        result.paths.push(...paths)
      })
    return result
  }
  _safeExpression(exp) {
    return `
      \${(() => {
        try {
          return ${exp.slice(1,-1)}
        } catch (err) {
          return ''
        }
      })() || ''}
    `.trim()
  }
}

module.exports =  new ExpressionsParser()
