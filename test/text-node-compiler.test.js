const compiler = require('../src/text-node-compiler')
let textNodeReactiveCompiler = require('../src/text-node-reactive-compiler')
textNodeReactiveCompiler.compile = jest.fn()
textNodeReactiveCompiler.compile.mockReturnValue('REACTIVE_COMPILER_PART')

describe('text-node-compiler', () => {
  describe('on compile', () => {
    it('simple text node', () => {
      expect(compiler.compile('parent', {data: 'node data'})).toMatchSnapshot();
    })
    it('text node with expression', () => {
      expect(compiler.compile('parent', {data: 'Helloo {status.fullname}!'})).toMatchSnapshot();
    })
  })
})
