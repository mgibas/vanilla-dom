const parser = require('../src/expressions-parser')

describe('expressions-parses', () => {
  describe('on parse', () => {
    it('returns undefined when no expressions', () => {
      expect(parser.parse('')).not.toBeDefined();
    })

    it.each([
      ['{state.fullname}'], 
      ['{state.firstname + state.lastname}'], 
      ['{state.fullname.toString()}'],
      ['{new Date(state.year, state.month, state.day).toString()}'],
      ['{state.firstname} and {state.lastname}']
    ])('return propper expression descriptor for %s',
      (expression) => {
        expect(parser.parse(expression)).toMatchSnapshot();
      }
    );
  })
})
