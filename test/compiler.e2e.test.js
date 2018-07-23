const compiler = require('../src/compiler')

describe('compiler', () => {
  describe('mounting compiled code', () => {
    beforeEach(()=>{
      window.document.body.innerHTML = ''
    })

    it.each([
      ['empty', ''], 
      ['simple', '<div></div>'], 
      ['with attributes', '<div foo="5" bar="some"></div>'], 
      ['multiple nodes', '<div></div><p></p>'], 
      ['text nodes', ` <div></div>some text and empty line
        
        <p></p>`], 
      ['nested', `<div><p>hello</p></div>`]
    ])('mount function recreates given template on a given node - %s',
      (testcaseName, template) => {
        let compiled = compiler.compile(template, {module:'closure'})
        let mount = eval(compiled)
        mount(window.document.body)
        expect(window.document.body.innerHTML).toMatchSnapshot();
      }
    );

    it.each([
      ['simple expressions', '<div foo="{state.foo}">{state.fullname}</div>'],
      ['multiple expressions', '<div foo="{state.foo} and {state.bar}">{state.foo} and {state.bar}</div>'],
      ['javascript expressions', '<div sum="{state.foo + state.bar + 2}">{state.foo + state.bar}</div>'],
      ['method expressions', '<div upper="{state.fullname.toUpperCase()}">{state.firstname.toUpperCase()}</div>']
    ])('mount function evaluates given expression - %s',
      (testcaseName, template) => {
        let state = {
          fullname: 'Maciej Gibas',
          firstname: 'Maciej',
          foo: 2,
          bar: 3
        }
        let compiled = compiler.compile(template, {module:'closure'})
        let mount = eval(compiled)
        mount(window.document.body, state)
        expect(window.document.body.innerHTML).toMatchSnapshot();
      }
    );

    it.each([
      ['simple expressions', '<div foo="{state.foo}">{state.fullname}</div>'],
      ['multiple expressions', '<div foo="{state.foo} and {state.bar}">{state.foo} and {state.bar}</div>'],
      ['javascript expressions', '<div sum="{state.foo + state.bar + 2}">{state.foo + state.bar}</div>'],
      ['method expressions', '<div upper="{state.fullname.toUpperCase()}">{state.firstname.toUpperCase()}</div>']
    ])('update state in dom on update call - %s',
      (testcaseName, template) => {
        let state = {
          fullname: 'Maciej Gibas',
          firstname: 'Maciej',
          foo: 2,
          bar: 3
        }
        let updatedState = {
          fullname: 'Foo Bar',
          firstname: 'Foo',
          foo: 300,
          bar: 500
        }
        let compiled = compiler.compile(template, {module:'closure'})
        let mount = eval(compiled)
        let update = mount(window.document.body, state)
        update(updatedState)
        expect(window.document.body.innerHTML).toMatchSnapshot();
      }
    );
  })
})
