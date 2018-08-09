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

Unfortunately its not all that sweet and disadvantage of this aproach is that compiled template will be bigger in size than html version of it. At the moment its about 2.5 times bigger (min+gzip) than our test template (gzip). Vanilla-dom was created in mind for rather small reusable components, so in a real world scenario difference will be neglibe or it can be even smaller than combination of template + framework
