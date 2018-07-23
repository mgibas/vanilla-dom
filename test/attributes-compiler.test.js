const compiler = require('../attributes-compiler')

describe('compiler', () => {
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
