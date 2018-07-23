const parser = require('../expressions-parser')

describe('expressions-parses', () => {
  describe('on parse', () => {
    it('returns undefined when no expressions', () => {
      expect(parser.parse('')).not.toBeDefined();
    })

    it.each([
      ['{state.fullname}', {paths: ['fullname'], template: '`${state.fullname}`'}], 
      ['{state.firstname + state.lastname}', {paths: ['firstname', 'lastname'], template: '`${state.firstname + state.lastname}`'}], 
      ['{state.fullname.toString()}', {paths: ['fullname'], template: '`${state.fullname.toString()}`'}],
      ['{new Date(state.year, state.month, state.day).toString()}', {paths: ['year','month','day'], template: '`${new Date(state.year, state.month, state.day).toString()}`'}],
      ['{state.firstname} and {state.lastname}', {paths: ['firstname', 'lastname'], template: '`${state.firstname} and ${state.lastname}`'}]
    ])('return propper expression descriptor for %s',
      (expression, expected) => {
        expect(parser.parse(expression)).toEqual(expected);
      }
    );
  })
})
