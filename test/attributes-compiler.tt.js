const compiler = require('../src/attributes-compiler')
let attributeUpdateCompiler = require('../src/attribute-update-compiler')
attributeUpdateCompiler.compile = jest.fn()
attributeUpdateCompiler.compile.mockReturnValue('UPDATE_COMPILER_PART')
attributeUpdateCompiler.compileSetAttribute = jest.fn()
attributeUpdateCompiler.compileSetAttribute.mockReturnValue('COMPILED_SET_ATTRIBUTE')

describe('attributes-compiler', () => {
  describe('on compile', () => {
    it('simple attributes', () => {
      expect(compiler.compile('element', {foo: 'bar', bar:'foo'}, {})).toMatchSnapshot();
    })
    it('reactive expressioon attribute', () => {
      expect(compiler.compile('element', {foo: '{{state.hey}}'}, {})).toMatchSnapshot();
    })
    it('multiple reactive expressioons in attribute value', () => {
      expect(compiler.compile('element', {foo: '{{state.hey}} and {{state.blah}}'}, {})).toMatchSnapshot();
    })
    it('event handler attribute', () => {
      expect(compiler.compile('element', {'on-click': 'this.handleClick'}, {})).toMatchSnapshot();
    })
  })
})
