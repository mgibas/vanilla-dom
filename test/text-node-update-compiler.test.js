const compiler = require('../src/text-node-update-compiler')

describe('text-node-update-compiler', () => {
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
