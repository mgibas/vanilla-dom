const compiler = require('../src/compiler')
const tagNodeCompiler = require('../src/tag-node-compiler.js')
const textNodeCompiler = require('../src/text-node-compiler.js')
tagNodeCompiler.compile = jest.fn()
textNodeCompiler.compile = jest.fn()
tagNodeCompiler.compile.mockReturnValue('console.log("COMPILED_TAG_NODE");')
textNodeCompiler.compile.mockReturnValue('console.log("COMPILED_TEXT_NODE");')

describe('compiler', () => {
  describe('on compile', () => {
    it('empty source', () => {
      expect(compiler.compile('')).toMatchSnapshot();
    })
    it('single tag node', () => {
      expect(compiler.compile('<div></div>')).toMatchSnapshot();
    })
    it('multiple tag nodes', () => {
      expect(compiler.compile('<div></div><p></p>')).toMatchSnapshot();
    })
    it('tag and text nodes', () => {
      expect(compiler.compile(`
        <div></div>
        some text

        ^ and empty line

        <p></p>
      `)).toMatchSnapshot();
    })
    it('nested nodes', () => {
      expect(compiler.compile(`
        <div>
          <p>hello</p>
        </div>
      `)).toMatchSnapshot();
    })
    it('default module type generates es6 export', () => {
      expect(compiler.compile('')).toMatchSnapshot();
    })
    it('commonjs module type', () => {
      expect(compiler.compile('', {module: 'commonjs'})).toMatchSnapshot();
    })
    it('simple closure export', () => {
      expect(compiler.compile('', {module: 'closure'})).toMatchSnapshot();
    })
  })
})
