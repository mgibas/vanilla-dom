const compiler = require('../src/compiler')
const stat = require('stats-lite')

describe('compiler', () => {
  const rounds = 100
  const population = 10000
  const state = {bars: []}
  const template = `<ul><li repeat-for="{{state.bars}}">Hello {{i}}!</li></ul>`
  const compiled = eval(compiler.compile(template, {module: 'closure'}))
  let update

  beforeEach(()=>{
    window.document.body.innerHTML = ''
    update = compiled(window.document.body, state)
  })

  it(`create ${population} rows`, () => {
    let results = []
    for(let i = 0; i < rounds; i++) {
      state.bars = []
      update(state) 
      state.bars = Array.apply(null, {length: population}).map(Number.call, Number)
      let time = process.hrtime()
      update(state) 
      let took = process.hrtime(time) 
      results.push(took[0] * 1000 + took[1]/1000000)
    }
    results = dropOutliers(results)

    console.log(`created ${population} rows in ${stat.median(results)}ms, std. deviation: ${stat.stdev(results)}`)
    //expect(stat.median(results)).toBeLessThan(150)
  })
  it(`delete ${population} rows`, () => {
    let results = []
    for(let i = 0; i < rounds; i++) {
      state.bars = Array.apply(null, {length: population}).map(Number.call, Number)
      update(state) 
      state.bars = []
      let time = process.hrtime()
      update(state) 
      let took = process.hrtime(time) 
      results.push(took[0] * 1000 + took[1]/1000000)
    }
    results = dropOutliers(results)

    console.log(`deleted ${population} rows in ${stat.median(results)}ms, std. deviation: ${stat.stdev(results)}`)
    //expect(stat.median(results)).toBeLessThan(20)
  })
  it(`update ${population} rows`, () => {
    state.bars = Array.apply(null, {length: population}).map(Number.call, Number)
    update(state) 
    let results = []
    for(let i = 0; i < rounds; i++) {
      for(let index = 0; index < population; index++) {
        state.bars[index]++
      }

      let time = process.hrtime()
      update(state) 
      let took = process.hrtime(time) 

      results.push(took[0] * 1000 + took[1]/1000000)
    }
    results = dropOutliers(results)

    console.log(`updating ${population} rows took ${stat.median(results)}ms, std. deviation: ${stat.stdev(results)}`)
    //expect(stat.median(results)).toBeLessThan(5)
  })
  it('selective update', () => {
    state.bars = Array.apply(null, {length: population}).map(Number.call, Number)
    update(state) 
    let results = []
    for(let i = 0; i < rounds; i++) {
      for(let tenth = 0; tenth < population; tenth = tenth + 10) {
        state.bars[tenth]++
      }

      let time = process.hrtime()
      update(state) 
      let took = process.hrtime(time) 

      results.push(took[0] * 1000 + took[1]/1000000)
    }
    results = dropOutliers(results)

    console.log(`selective update within ${population} rows took ${stat.median(results)}ms, std. deviation: ${stat.stdev(results)}`)
    //expect(stat.median(results)).toBeLessThan(5)
  })
})

function dropOutliers(array) {
  let by = Math.floor(array.length * 0.1)
  return array.sort((a,b) => a-b).slice(by, array.length - by)
}
