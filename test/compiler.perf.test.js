const compiler = require('../src/compiler')

describe('compiler', () => {
  const state = {
    foo:'foo',
    bars: [{name:'joe'}, {name:'billy'}]
  }
  const template = `
    <div foo="{{state.foo}}">Some {{state.foo}} node</div>
    <div foo="{{state.foo}}">Some {{state.foo}} node</div>
    <div foo="{{state.foo}}">Some {{state.foo}} node</div>
    <div foo="{{state.foo}}">Some {{state.foo}} node</div>
    <ul>
      <li repeat-for="{{state.bars}}">Hello {{state.bars[i].name}}!</li>
    </ul>
    <ul>
      <li repeat-for="{{state.bars}}">Hello {{state.bars[i].name}}!</li>
    </ul>
    <ul>
      <li repeat-for="{{state.bars}}">Hello {{state.bars[i].name}}!</li>
    </ul>
    <ul>
      <li repeat-for="{{state.bars}}">Hello {{state.bars[i].name}}!</li>
    </ul>
  `
  const compiledTemplate = eval(compiler.compile(template, {module: 'closure'}))

  beforeEach(()=>{
    window.document.body.innerHTML = ''
  })

  it('mount compiled code 1000 times - less than 1000ms', () => {
    var time = process.hrtime()
    for(let i = 0; i < 1000; i++)
      compiledTemplate(window.document.body, state)
    let took = process.hrtime(time) 
    let elapsed = took[0] * 1000 + took[1]/1000000
    expect(elapsed).toBeLessThan(1000)
  })
  it('update template 1000 times - less than 100ms', () => {
    let update = compiledTemplate(window.document.body, state)

    var time = process.hrtime()
    for(let i = 0; i < 1000; i++)
      update(state)
    let took = process.hrtime(time) 

    let elapsed = took[0] * 1000 + took[1]/1000000
    expect(elapsed).toBeLessThan(100)
  })
})
