const compiler = require('../src/text-node-reactive-compiler')

describe('text-node-reactive-compiler', () => {
  describe('on compile', () => {
    it('single path', () => {
      expect(compiler.compile('testElement', {
        paths: ['bar'],
        template: () => '"test-template-string"'
      })).toMatchSnapshot();
    })
    it('multiple paths', () => {
      expect(compiler.compile('testElement', {
        paths: ['bar', 'foo'],
        template: () => '"test-template-string"'
      })).toMatchSnapshot();
    })
  })
})
