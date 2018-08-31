const uglifyjs = require('uglify-js')
const babel = require('babel-core')
const compiler = require('../src/compiler')
const fs = require('fs')
const temp = require('temp')
const zlib = require('zlib')

describe('compiled template size', () => {
  let options
  beforeEach(()=>{
    options = {state:'st', module: 'closure'}
    window.document.body.innerHTML = ''
  })
  afterEach(() => {
    temp.cleanupSync()
  })

  it('should be smaller than 3 template sizes', (done) => {
    let template = `
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>vanilla-dom</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-sm-6 smallpad">
                <button type='button' class='btn btn-primary btn-block' on-click='this.fire'>Fire!</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          <tr repeat-for="{{st.data}}" class="{{this.itemClass(i)}}">
            <td class="col-md-1">{{items[i].id}}</td>
            <td class="col-md-4">
              <a on-click="this.select" data-index="{{i}}">{{items[i].label}}</a>
            </td>
            <td class="col-md-1"><a data-index="{{i}}" on-click="this.del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
            <td class="col-md-6"></td>
          </tr>
        </tbody>
      </table>
    `
    let compiled = compiler.compile(template, options)
    let transpiled = babel.transform(compiled, {
        presets: ['es2015']
    });
    let minified = uglifyjs.minify(transpiled.code, { compress: false, mangle: true })
    let gzip = zlib.createGzip()
    let templateStream = temp.createWriteStream();
    let compiledStream = temp.createWriteStream();
    gzip.pipe(templateStream)
    gzip.write(template)
    templateStream.on('finish', () => {
      gzip = zlib.createGzip()
      gzip.pipe(compiledStream)
      gzip.write(minified.code)
      compiledStream.on('finish', () => {
        done()
        let templateStats = fs.statSync(templateStream.path)
        let compiledStats = fs.statSync(compiledStream.path)
        expect(compiledStats.size/templateStats.size).toBeLessThan(3)
      })
      gzip.end()
    })
    gzip.end()
  })
})
