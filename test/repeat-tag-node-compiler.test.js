const compiler = require('../src/repeat-tag-node-compiler')
let tagNodeCompiler = require('../src/tag-node-compiler')
tagNodeCompiler.compile = jest.fn()
tagNodeCompiler.compile.mockImplementation((a,b,c) => `TAG_NODE_COMPILER_PART('${a}', '${b}', '${c}')`)

describe('repeat-tag-node-compiler', () => {
  describe('on compile', () => {
    it('simple repeat-for', () => {
      expect(compiler.compile('parent', {
        attribs: { 'repeat-for': '{{state.objects}}' }
      }, (child, compiler) => {}))
        .toMatchSnapshot();
    })
  })
})
