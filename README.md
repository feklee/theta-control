About
=====

*Theta Control* is a Firefox OS app for remote controlling the Ricoh Theta 360°
panorama camera.

It is available on [Firefox Markteplace][4].


Development
===========

Requirements
------------

  * [Compass][1]: To compile the SCSS into CSS.

  * [Node.js][5]: To create `package.zip` for distribution.

  * [ptp.js][3]: JavaScript PTP/IP library in version 2

    Install into: `package/vendor/ptp.js`

Coding conventions
------------------

  * Code needs to validate with JSLint.

  * Comments are in Markdown.

  * Don’t use constructors: JavaScript is a classless language.

  * Don’t throw exceptions. JavaScript is a weakly typed language, allowing
    functions to return different types of values, including types indicating
    errors.

  * Versioning: major.minor.bug-fix

Reading
-------

Yasuhiro Fujii’s article [“Play with Ricoh THETA w/o Smartphones”][2] lists
commands and device properties that can be accessed by PTP/IP.

How to prepare package for uploading to Firefox Marketplace
-----------------------------------------------------------

Run with Node.js:

    package-zip-creator/app.js


License
=======

Except where noted otherwise, files are licensed under the MIT License.

The MIT License (MIT)
---------------------

Copyright (c) 2014 [Felix E. Klee](felix.klee@inka.de)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[1]: http://compass-style.org/
[2]: http://mimosa-pudica.net/ricoh-theta.html
[3]: https://github.com/feklee/ptp.js
[4]: https://marketplace.firefox.com/app/theta-control
[5]: http://en.wikipedia.org/wiki/Node.js
