const compiler = require('../src/compiler')

describe('compiler', () => {
  let options
  beforeEach(()=>{
    options = {state:'st', module: 'closure'}
    window.document.body.innerHTML = ''
  })

  describe('mounting compiled code', () => {
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
        let compiled = compiler.compile(template, options)
        let mount = eval(compiled)
        mount(window.document.body)
        expect(window.document.body.innerHTML).toMatchSnapshot();
      }
    );

    it.each([
      ['simple expressions', '<div foo="{{st.foo}}">{{st.fullname}}</div>'],
      ['property expression on undefined property', '<div foo="{{st.missing}}">{{st.missing}}</div>'],
      ['nested property expression on undefined property', '<div foo="{{st.missing.missingbad}}">{{st.missing.missingbad}}</div>'],
      ['multiple expressions with undefined properties', '<div foo="{{st.missing}}">{{st.missing}}  and {{st.somissing}}</div>'],
      ['multiple expressions', '<div foo="{{st.foo}} and {{st.bar}}">{{st.foo}} and {{st.bar}}</div>'],
      ['javascript expressions', '<div sum="{{st.foo + st.bar + 2}}">{{st.foo + st.bar}}</div>'],
      ['method expressions', '<div upper="{{st.fullname.toUpperCase()}}">{{st.firstname.toUpperCase()}}</div>']
    ])('mount function evaluates given expression - %s',
      (testcaseName, template) => {
        let state = {
          fullname: 'Maciej Gibas',
          firstname: 'Maciej',
          foo: 2,
          bar: 3
        }
        let compiled = compiler.compile(template, options)
        let mount = eval(compiled)
        mount(window.document.body, state)
        expect(window.document.body.innerHTML).toMatchSnapshot();
      }
    );

    it.each([
      ['simple expressions', '<div foo="{{st.foo}}">{{st.fullname}}</div>'],
      ['property expression on undefined property', '<div foo="{{st.missing}}">{{st.missing}}</div>'],
      ['nested property expression on undefined property', '<div foo="{{st.missing.missingbad}}">{{st.missing.missingbad}}</div>'],
      ['multiple expressions with undefined properties', '<div foo="{{st.missing}}">{{st.missing}}  and {{st.somissing}}</div>'],
      ['multiple expressions', '<div foo="{{st.foo}} and {{st.bar}}">{{st.foo}} and {{st.bar}}</div>'],
      ['javascript expressions', '<div sum="{{st.foo + st.bar + 2}}">{{st.foo + st.bar}}</div>'],
      ['method expressions', '<div upper="{{st.fullname.toUpperCase()}}">{{st.firstname.toUpperCase()}}</div>']
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
        let compiled = compiler.compile(template, options)
        let mount = eval(compiled)
        let update = mount(window.document.body, state)
        update(updatedState)
        expect(window.document.body.innerHTML).toMatchSnapshot();
      }
    );

    describe('arrays', () => {
      it.each([
        ['simple', '<ul><li repeat-for="{{st.objects}}">{{items[i].name}}</li></ul>'],
        ['custom "as"', '<ul><li repeat-for="{{st.objects}}" repeat-as="rows">{{rows[i].name}}</li></ul>'],
        ['custom "index"', '<ul><li repeat-for="{{st.objects}}" repeat-index="b">{{items[b].name}}</li></ul>'],
        ['js expression', '<ul><li repeat-for="{{st.objects.concat(st.objects)}}">{{items[i].name}}</li></ul>'],
        ['nested array', `
          <ul>
            <li repeat-for="{{st.objects}}">
              <span repeat-for="{{items[i].chars}}" repeat-as="chars" repeat-index="j">{{chars[j]}}</span>
            </li>
          </ul>`]
      ])('mounts array using initial state data - %s', (testcaseName, template) => {
        let state = {objects: [{name: 'foo', chars: ['f','o','o']},{name: 'bar', chars: ['b','a','r']}]}
        let compiled = compiler.compile(template, options)
        let mount = eval(compiled)
        mount(window.document.body, state)
        expect(window.document.body.innerHTML).toMatchSnapshot();
      })

      it.each([
        ['simple', '<ul><li repeat-for="{{st.objects}}">{{items[i].name}}</li></ul>'],
        ['custom "as"', '<ul><li repeat-for="{{st.objects}}" repeat-as="rows">{{rows[i].name}}</li></ul>'],
        ['custom "index"', '<ul><li repeat-for="{{st.objects}}" repeat-index="b">{{items[b].name}}</li></ul>'],
        ['js expression', '<ul><li repeat-for="{{st.objects.concat(st.objects)}}">{{items[i].name}}</li></ul>'],
        ['nested array', `
          <ul>
            <li repeat-for="{{st.objects}}">
              <span repeat-for="{{items[i].chars}}" repeat-as="chars" repeat-index="j">{{chars[j]}}</span>
            </li>
          </ul>`]
      ])('update without array length change - %s', (testcaseName, template) => {
        let state = {objects: [{name: 'foo', chars: 'foo'.split('')},{name: 'bar', chars: 'bar'.split('')}]}
        let newState = {objects: [{name: 'foo-updated', chars: 'foo-updated'.split('')},{name: 'bar-updated', chars: 'bar-updated'.split('')}]}
        let compiled = compiler.compile(template, options)
        let mount = eval(compiled)
        let update = mount(window.document.body, state)

        update(newState)

        expect(window.document.body.innerHTML).toMatchSnapshot();
      })

      it.each([
        ['add item', [{name: 'foo'},{name: 'bar'}], [{name: 'foo'},{name: 'bar'},{name: 'oof'}]],
        ['no array to array with items', null, [{name: 'foo'},{name: 'bar'}]],
        ['remove item', [{name: 'foo'},{name: 'bar'},{name: 'oof'}], [{name: 'foo'},{name: 'oof'}]]
      ])('splicing - %s', (testcaseName, from, to) => {
        let state = {objects: from}
        let newState = {objects: to}
        let compiled = compiler.compile('<ul><li repeat-for="{{st.objects}}">{{items[i].name}}</li></ul>', options)
        let mount = eval(compiled)
        let update = mount(window.document.body, state)

        update(newState)

        expect(window.document.body.innerHTML).toMatchSnapshot();
      })
    })
    describe('events binding', () => {
      it('simple click event', () => {
        let ctx = {fire: jest.fn()}
        let template = `<button on-click="this.fire" />`
        let compiled = compiler.compile(template, options)
        let mount = eval(compiled).bind(ctx)
        mount(window.document.body, {})
        let button = window.document.body.querySelector('button')
        button.click()
        expect(ctx.fire).toHaveBeenCalled()
      })
    })
  })
})
