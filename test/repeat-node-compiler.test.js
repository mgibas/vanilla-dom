const compiler = require('../src/repeat-node-compiler')
let tagNodeCompiler = require('../src/tag-node-compiler')
let repeatNodeUpdateCompiler = require('../src/repeat-node-update-compiler')
let childrenCompiler = jest.fn()
tagNodeCompiler.compile = jest.fn()
repeatNodeUpdateCompiler.compile = jest.fn()
childrenCompiler.mockImplementation((a,b) => `CHILDREN_COMPILER_PART('${a}', '${b}')`)
tagNodeCompiler.compile.mockImplementation((a,b,c) => `TAG_NODE_COMPILER_PART('${a}', '${b}', '${c===childrenCompiler}')`)
repeatNodeUpdateCompiler.compile.mockImplementation((a,b,c,d) => `REPEAT_NODE_UPDATE_COMPILER_PART('${a}', '${b}', '${c===childrenCompiler}', '${d}')`)

describe('repeat-node-compiler', () => {
  let options = {state:'st'}

  describe('on compile', () => {
    it('simple token', () => {
      expect(compiler.compile('parent', {
        attribs: { 'repeat-for': '{{st.items}}' }
      }, childrenCompiler, options))
        .toMatchSnapshot();
    })
    it('custom as and index', () => {
      expect(compiler.compile('parent', {
        attribs: { 'repeat-for': '{{st.items}}', 'repeat-as': 'rows', 'repeat-index': 'z'}
      }, childrenCompiler, options))
        .toMatchSnapshot();
    })
  })
})
