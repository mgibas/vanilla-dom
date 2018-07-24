const helpers = require('./helpers')
const textParser = require('./text-parser')
const tagNodeCompiler = require('./tag-node-compiler.js')

class RepeaterNodeCompiler {

  compile (parentName, tagNode, childrenCompiler) {
    let elName = `${parentName}_el`
    let parsed = textParser.parse(tagNode.attribs['repeat-for'])
    delete tagNode.attribs['repeat-for'] 
    return helpers.rewrite(helpers.closure(`
      let items = ${parsed.value()}
      if(!items) return
      for(let i = 0; i<items.length;i++) {
        ${tagNodeCompiler.compile(parentName, tagNode, childrenCompiler)} 
      } 
    `))
  }
}

module.exports =  new RepeaterNodeCompiler()
