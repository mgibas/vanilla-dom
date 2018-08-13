# vanilla-dom
Not yet another vdom engine - just vanilla dom engine!

## Whats that
vanilla-dom is a template engine - or more like template compiler.
In its core it will compile given html into DOM API calls.

## Why?
This aproach has multiple advantages:
-  fast - since each template is compiled to pure js its "vanilla js fast"!
-  even faster updates - compiled template holds reference to created nodes so it can update its content directly without any diffs, dirty checks or patching
-  no dependencies shipped to client - all happens during build
-  since its a vanilla js it will work with any library/framework - you can create reusable component and use it with vuejs, react, angular, you name it - it will just work. You want to use components made with X,Y,Z library inside vanilla-dom - it will just work.
-  you dont need to work with elaborated stack, no JSX, no js template literals, just pure HTML. Your well known tools will be happy

Unfortunately its not all that sweet and disadvantage of this aproach is that compiled template will be bigger in size than html version of it. At the moment its about 2.5 times bigger (min+gzip) than our test template (gzip). Vanilla-dom was created for rather small reusable components, so in a real world scenario difference will be neglibe or it can be even smaller than combination of template + framework

## Guide

### Install
```
yarn add @vanilla-ftw/vanilla-dom
```
or 
```
npm install @vanilla-ftw/vanilla-dom
```

### Compile your template
I created webpack loader [vanilla-dom-loader](http://github.com/mgibas/vanilla-dom-loader) that will take care of compilation but of there are some reasons you want to do it manually, here it is:
```
const compiler = require('@vanilla-ftw/vanilla-dom')
const template = require('your-template.html')

let compiled = compiler.compile(template)
```

#### `compiler.compile(template, [options])`

arguments:
-  `{string} - template`
-  `{object} optional - options`
    * `{string} - state` default `st` - name of the state object you will use in your templates ie. `st.fullname`, `st.checked` etc.
    * `{string} - module` default `es6` - what sort of _module_ mechanism compiled template will use. Available options are: `es6`, `commonjs`, `closure`. 
 
### Use template
Compiled template is a function so rendering/mounting/initializing/you-name-it is simple as this:
```
import template from './my-template.html`

let update = template(document.body, { foo: 'bar' })
```
As a result template should be rendered to provided node `document.body` with a given state `{ foo: 'bar' }`. This call returns a function that you can use whenever you want to update dom ie. on state changes:

```
update(newState)
```

This function will update state on every node that has *any* `{{}}` expression.

## Features

vanilla-dom is very simple and flexible by design so dont expect if/else, routers etc. In its core is just html with js expressions.

### Simple property expressions
Every value comes from a state object. By default you can access it using 'st' - feel free to use other name (compiler option)
```
<div foo="{{st.foo}}">
  Hello {{st.bar}}
</div>
```

### JS expressions
```
<div foo="{{st.foo + st.bar}}" calc="{{2 + 3}}">
  Hello {{st.bar}}
  <p>Today is {{ Date.now().toLocaleDateString() }}</p>
</div>
```

### For loop
```
<ul>
  <li repeat-for="{{st.myArray}}">{{items[i].name}}</li>
</ul>
```
By default you can access your item using `items` array and index `i`, all of that can be simply customized like this:
```
<ul>
  <li repeat-for="{{st.myArray}}" repeat-as="rows" repeat-index="index">{{rows[index].name}}</li>
</ul>
```
This customization can be also used in nested arrays:
```
<div repeat-for="{{st.myArray}}">
  <h1>{{items[i].title}}</h1>
  <ul>
    <li repeat-for="{{items[i].subItems}}" repeat-as="rows" repeat-index="index">{{rows[index].name}}</li>
  </ul>
</div>
```

### Event bindings
```
<button on-click="this.fire" />
```
For this example to work you need to _mount_ your template with desired `this` so ie.:
```
import template from './my-template.html`

template = template.bind(this)
```

You can also put your handlers directly in state object but that seemed a bit weird to me.

As you can see its very basic and simple - though thanks to that its just javascript your options are endless. You want a filters in array ? No problem just write filtering method and use in expression ie. ``` repeat-for="{{ this.myFilter(st.myArray) }}```

## Compatibility
Template is compiled to es2015 so you can transpile it to whatever version you need - I just make sure it will transpile to es5 without a need of polyfills. 

