const compiler = require('../src/text-node-update-compiler')

describe('text-node-update-compiler', () => {
  let options = {state:'st'}

  describe('on compile', () => {
    it('single path', () => {
      expect(compiler.compile('testElement', {
        paths: ['bar'],
        template: () => '"test-template-string"'
      }, options)).toMatchSnapshot();
    })
    it('multiple paths', () => {
      expect(compiler.compile('testElement', {
        paths: ['bar', 'foo'],
        template: () => '"test-template-string"'
      }, options)).toMatchSnapshot();
    })
  })
})
