const compiler = require('../src/text-node-compiler')
let textNodeUpdateCompiler = require('../src/text-node-update-compiler')
textNodeUpdateCompiler.compile = jest.fn()
textNodeUpdateCompiler.compile.mockReturnValue('UPDATE_COMPILER_PART')

describe('text-node-compiler', () => {
  describe('on compile', () => {
    it('simple text node', () => {
      expect(compiler.compile('parent', {data: 'node data'})).toMatchSnapshot();
    })
    it('text node with expression', () => {
      expect(compiler.compile('parent', {data: 'Helloo {{status.fullname}}!'})).toMatchSnapshot();
    })
  })
})
