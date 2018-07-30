const compiler = require('../src/compiler')
const tagNodeCompiler = require('../src/tag-node-compiler.js')
const textNodeCompiler = require('../src/text-node-compiler.js')
tagNodeCompiler.compile = jest.fn()
textNodeCompiler.compile = jest.fn()
tagNodeCompiler.compile.mockReturnValue('console.log("COMPILED_TAG_NODE");')
textNodeCompiler.compile.mockReturnValue('console.log("COMPILED_TEXT_NODE");')

describe('compiler', () => {

  describe('on compile', () => {
    let options
    
    beforeEach(()=>{
      options = {state:'st'}
    })
    
    it('empty source', () => {
      expect(compiler.compile('', options)).toMatchSnapshot();
    })
    it('single tag node', () => {
      expect(compiler.compile('<div></div>', options)).toMatchSnapshot();
    })
    it('multiple tag nodes', () => {
      expect(compiler.compile('<div></div><p></p>', options)).toMatchSnapshot();
    })
    it('tag and text nodes', () => {
      expect(compiler.compile(`
        <div></div>
        some text

        ^ and empty line

        <p></p>
      `, options)).toMatchSnapshot();
    })
    it('nested nodes', () => {
      expect(compiler.compile(`
        <div>
          <p>hello</p>
        </div>
      `, options)).toMatchSnapshot();
    })
    it('default module type generates es6 export', () => {
      expect(compiler.compile('', options)).toMatchSnapshot();
    })
    it('commonjs module type', () => {
      options.module = 'commonjs'
      expect(compiler.compile('', options)).toMatchSnapshot();
    })
    it('simple closure export', () => {
      options.module = 'closure'
      expect(compiler.compile('', options)).toMatchSnapshot();
    })
  })
})
