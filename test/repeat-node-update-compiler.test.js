const compiler = require('../src/repeat-node-update-compiler')
let tagNodeCompiler = require('../src/tag-node-compiler')
let childrenCompiler = jest.fn()
tagNodeCompiler.compile = jest.fn()
childrenCompiler.mockImplementation((a,b) => `CHILDREN_COMPILER_PART('${a}', '${b}')`)
tagNodeCompiler.compile.mockImplementation((a,b,c) => `TAG_NODE_COMPILER_PART('${a}', '${b}', '${c}')`)

describe('repeat-node-update-compiler', () => {
  describe('on compile', () => {
    it('single path', () => {
      let parsed = {
        paths: ['bars'],
        value: () => 'state.bars'
      }
      expect(compiler.compile('parent', {}, childrenCompiler, parsed, 'items', 'i'))
        .toMatchSnapshot();
    })
    it('multipl paths', () => {
      let parsed = {
        paths: ['bars', 'foos'],
        value: () => 'state.bars.push(...state.foos)'
      }
      expect(compiler.compile('parent', {}, childrenCompiler, parsed, 'items', 'i'))
        .toMatchSnapshot();
    })
  })
})
