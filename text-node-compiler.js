class TextNodeCompiler {

  compile (parentName, node) {
    return `
      (() => {
        let tel = document.createTextNode(\`${node.data}\`)
        ${parentName}.appendChild(tel)
      })();
    `
  }
}

module.exports =  new TextNodeCompiler()
