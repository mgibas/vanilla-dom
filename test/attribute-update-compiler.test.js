const compiler = require('../src/attribute-update-compiler')

describe('attribute-update-compiler', () => {
  describe('on compile', () => {
    it('single path', () => {
      expect(compiler.compile('testElement', 'foo',{
        paths: ['bar'],
        value: () => 1,
        template: () => '"test-template-string"'
      }, {state: 'st'})).toMatchSnapshot();
    })
    it('multiple paths', () => {
      expect(compiler.compile('testElement', 'foo',{
        paths: ['bar', 'foo'],
        value: () => 1,
        template: () => '"test-template-string"'
      }, {state: 'st'})).toMatchSnapshot();
    })
  })
})
