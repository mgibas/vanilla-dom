class AttributesCompiler {

  compile (elementName, attributes) {
    return Object.keys(attributes).map((a)=>{
      return `
        ${elementName}.setAttribute('${a}','${attributes[a]}');
      `
    }).join('')
  }
}

module.exports = new AttributesCompiler()
