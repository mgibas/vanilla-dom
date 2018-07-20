const compiler = require('../compiler')
let attributesCompiler = require('../attributes-compiler')
attributesCompiler.compile = jest.fn()
attributesCompiler.compile.mockReturnValue('COMPILED-ATTRIBUTES')

describe('compiler', () => {
  describe('on compile', () => {
    it('empty source', () => {
      expect(compiler.compile('')).toMatchSnapshot();
    })
    it('single tag node', () => {
      expect(compiler.compile('<div></div>')).toMatchSnapshot();
    })
    it('single tag node with attributes', () => {
      expect(compiler.compile('<div foo="5" bar="some"></div>')).toMatchSnapshot();
    })
    it('multiple tag nodes', () => {
      expect(compiler.compile('<div></div><p></p>')).toMatchSnapshot();
    })
    it('text nodes', () => {
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
  })
})
