const compiler = require('../compiler');

describe('compiler', () => {
  describe('on compile', () => {
    it('returns provided source', () => {
      expect(compiler.compile('let x=5;')).toMatchSnapshot();
    })
    describe('script contains marked template literal', () => {
      it('returns render function', () => {
        expect(compiler.compile('let x=5;')).toMatchSnapshot();
      })
    }) 
  })
})
