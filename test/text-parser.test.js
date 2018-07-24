const parser = require('../src/text-parser')

describe('text-parses', () => {
  describe('on parse', () => {
    it('returns undefined when no expressions', () => {
      expect(parser.parse('')).not.toBeDefined();
    })

    let testCases = [
      ['single property', '{{state.fullname}}'], 
      ['simple js', '{{state.firstname + state.lastname}}'], 
      ['method call', '{{state.fullname.toString()}}'],
      ['properties in method call', '{{new Date(state.year, state.month, state.day).toString()}}'],
      ['mixed with text', '{{state.firstname}} and {{state.lastname}}']
    ]
    it.each(testCases)('return propper parsing result - %s',
      (_, expression) => {
        expect(parser.parse(expression)).toMatchSnapshot();
      }
    );
    it.each(testCases)('creates propper template function - %s',
      (_, expression) => {
        expect(parser.parse(expression).template()).toMatchSnapshot();
      }
    );
    it.each(testCases)('creates propper template function that can rescope - %s',
      (_, expression) => {
        expect(parser.parse(expression).template('rescoped')).toMatchSnapshot();
      }
    );
    it.each(testCases)('creates propper value function - %s',
      (_, expression) => {
        expect(parser.parse(expression).value()).toMatchSnapshot();
      }
    );
    it.each(testCases)('creates propper value function that can rescope - %s',
      (_, expression) => {
        expect(parser.parse(expression).value('rescoped')).toMatchSnapshot();
      }
    );
  })
})
