const compiler = require('../src/attribute-update-compiler')

describe('attribute-update-compiler', () => {
  describe('on compile', () => {
    it('single path', () => {
      expect(compiler.compile('testElement', 'foo',{
        paths: ['bar'],
        template: () => '"test-template-string"'
      })).toMatchSnapshot();
    })
    it('multiple paths', () => {
      expect(compiler.compile('testElement', 'foo',{
        paths: ['bar', 'foo'],
        template: () => '"test-template-string"'
      })).toMatchSnapshot();
    })
  })
})
