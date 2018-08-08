# vanilla-dom
Not yet another vdom engine - just vanilla dom engine!

## Whats that
vanilla-dom is a template engine - or more like template compiler.
In its core it will compile given html into DOM api calls.

## Why?
This aproach has multiple advantages:
-  fast - since each template is compiled to pure js its "vanilla js fast"!
-  even faster updates - compiled template holds reference to created nodes so it can update its content directly without any diffs, dirty checks or patching
-  no 3rd party code - you dont need to include countless libraries and dependencies just to 
