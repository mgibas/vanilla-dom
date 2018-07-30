const parser = require('../src/text-parser')

describe('text-parses', () => {
  let options = {state:'st'}
  
  describe('on parse', () => {
    it('returns undefined when no expressions', () => {
      expect(parser.parse('', options)).not.toBeDefined();
    })

    let testCases = [
      ['single property', '{{st.fullname}}'], 
      ['simple js', '{{st.firstname + st.lastname}}'], 
      ['method call', '{{st.fullname.toString()}}'],
      ['properties in method call', '{{new Date(st.year, st.month, st.day).toString()}}'],
      ['mixed with text', '{{st.firstname}} and {{st.lastname}}']
    ]
    it.each(testCases)('return propper parsing result - %s',
      (_, expression) => {
        expect(parser.parse(expression, options)).toMatchSnapshot();
      }
    );
    it.each(testCases)('creates propper template function - %s',
      (_, expression) => {
        expect(parser.parse(expression, options).template()).toMatchSnapshot();
      }
    );
    it.each(testCases)('creates propper template function that can rescope - %s',
      (_, expression) => {
        expect(parser.parse(expression, options).template('rescoped')).toMatchSnapshot();
      }
    );
    it.each(testCases)('creates propper value function - %s',
      (_, expression) => {
        expect(parser.parse(expression, options).value()).toMatchSnapshot();
      }
    );
    it.each(testCases)('creates propper value function that can rescope - %s',
      (_, expression) => {
        expect(parser.parse(expression, options).value('rescoped')).toMatchSnapshot();
      }
    );
  })
})
