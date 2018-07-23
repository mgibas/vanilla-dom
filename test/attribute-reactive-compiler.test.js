const compiler = require('../src/attribute-reactive-compiler')

describe('attribute-reactive-compiler', () => {
  describe('on compile', () => {
    it('single path', () => {
      expect(compiler.compile('testElement', 'foo',{
        paths: ['bar'],
        template: '"test-template-string"'
      })).toMatchSnapshot();
    })
    it('multiple paths', () => {
      expect(compiler.compile('testElement', 'foo',{
        paths: ['bar', 'foo'],
        template: '"test-template-string"'
      })).toMatchSnapshot();
    })
  })
})
