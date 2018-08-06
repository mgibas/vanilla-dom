const esprima = require('esprima')
const tagRegExp = /\{\{((?:.|\n)+?)\}\}/gm

class TextParser {
  parse (source, options) {
    if (!tagRegExp.test(source)) return
    let result = {
      rawTokens: [],
      tokens: []
    }
    
    let matches = source.match(tagRegExp)
    matches.forEach((match) => {
      let token = match.slice(2,-2) 
      let jsTokens = esprima.parse(token, { tokens: true, range: true }).tokens

      result.rawTokens.push(match)
      result.tokens.push(token)
      result.template = () => {
        let template = source
        result.rawTokens.forEach((t) => {
          let token = t.slice(2,-2) 
          token = `\${(()=>{
            try{
              let val = (${token})
              return val !== null && val !== undefined ? val : '' 
            }catch(err){
              return ''
            }
          })()}` 
          template = template.replace(t, token)
        })  
        return `\`${template}\``
      }
      result.value = () => {
        let token = result.tokens.length === 1 ? result.tokens[0] : 'null'
        return `(() => { try { return (${token}) } catch (err) { return } })()`
      }
    })
    return result
  }
}

module.exports =  new TextParser()
