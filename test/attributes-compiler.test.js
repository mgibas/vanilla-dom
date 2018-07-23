const compiler = require('../src/attributes-compiler')
let attributeReactiveCompiler = require('../src/attribute-reactive-compiler')
attributeReactiveCompiler.compile = jest.fn()
attributeReactiveCompiler.compile.mockReturnValue('REACTIVE_COMPILER_PART')

describe('attributes-compiler', () => {
  describe('on compile', () => {
    it('simple attributes', () => {
      expect(compiler.compile('element', {foo: 'bar', bar:'foo'})).toMatchSnapshot();
    })
    it('reactive expressioon attribute', () => {
      expect(compiler.compile('element', {foo: '{state.hey}'})).toMatchSnapshot();
    })
    it('multiple reactive expressioons in attribute value', () => {
      expect(compiler.compile('element', {foo: '{state.hey} and {state.blah}'})).toMatchSnapshot();
    })
  })
})
