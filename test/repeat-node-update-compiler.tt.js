const compiler = require('../src/repeat-node-update-compiler')
let tagNodeCompiler = require('../src/tag-node-compiler')
let childrenCompiler = jest.fn()
tagNodeCompiler.compile = jest.fn()
childrenCompiler.mockImplementation((a,b) => `CHILDREN_COMPILER_PART('${a}', '${b}')`)
tagNodeCompiler.compile.mockImplementation((a,b,c) => `TAG_NODE_COMPILER_PART('${a}', '${b}', '${c}')`)

describe('repeat-node-update-compiler', () => {
  let options = {
    as:'items',
    index:'i',
    state:'st'
  }

  describe('on compile', () => {
    it('single path', () => {
      let parsed = {
        paths: ['bars'],
        value: () => 'st.bars'
      }
      expect(compiler.compile('parent', {}, parsed, options))
        .toMatchSnapshot();
    })
    it('multipl paths', () => {
      let parsed = {
        paths: ['bars', 'foos'],
        value: () => 'st.bars.push(...st.foos)'
      }
      expect(compiler.compile('parent', {}, parsed, options))
        .toMatchSnapshot();
    })
  })
})
