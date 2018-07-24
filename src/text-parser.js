const esprima = require('esprima')
const tagRegExp = /\{\{((?:.|\n)+?)\}\}/gm
const defaultScope = 'state'

class TextParser {
  parse (source) {
    if (!tagRegExp.test(source)) return
    let result = {
      rawTokens: [],
      tokens: [],
      paths: []
    }
    
    let matches = source.match(tagRegExp)
    matches.forEach((match) => {
      let token = match.slice(2,-2) 
      let jsTokens = esprima.parse(token, { tokens: true, range: true }).tokens
      let paths = jsTokens
        .filter((t, i) => { 
          return t.type === 'Identifier' && (i >= jsTokens.length -1 || jsTokens[i+1].value !== '(')  
        })
        .map((t)=> t.value)
        .join('.')
        .split(defaultScope + '.')
        .filter((val) => val) 
        .map((path) => path[path.length-1] === '.' ? path.slice(0,-1) : path)

      result.rawTokens.push(match)
      result.tokens.push(token)
      result.paths.push(...paths)
      result.template = (scope, from = defaultScope) => {
        let template = source
        result.rawTokens.forEach((t) => {
          let token = t.slice(2,-2) 
          if(scope) token = this._rescopeToken(token, from, scope)
          token = `\${(()=>{try{return (${token})}catch(err){return ''}})() || ''}` 
          template = template.replace(t, token)
        })  
        return `\`${template}\``
      }
      result.value = (scope, from = defaultScope) => {
        let token = result.tokens.length === 1 ? result.tokens[0] : 'null'
        if(scope) token = this._rescopeToken(token, from, scope)
          
        return `(() => { try { return (${token}) } catch (err) { return } })()`
      }
    })
    return result
  }
  _rescopeToken(token, from, scope) {
    return token.replace(new RegExp(scope + '.', 'g'), scope + '.') 
  }
}

module.exports =  new TextParser()
