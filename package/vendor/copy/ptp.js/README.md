Introduction
============

*ptp.js* is a JavaScript library providing *limited* functionality for
controlling cameras via [PTP][1]/IP: *Picture Transfer Protocol* via an
IP-based network


Disclaimer
==========

At the moment, this library is just a quick hack by [Felix][3] written for
remote controlling a [Ricoh Theta][2]. The initial version basically offers the
same functionality as `ThetaShutterProc.c`, a set of C functions part of
[ThetaShutter_PQIAirPen002.zip][6] and published by [MobileHackerz][4] under
the [WTPFL][5].


Requirements
============

  * [RequireJS][7]

  * [TCPSocket API][8], available on Firefox OS 1.x via `navigator.mozTCPSocket`


Reading
=======

  * 2000-07-05 PTP specification: [pima15740-2000.pdf][9]

  * gPhoto PTP/IP documentation: [www.gphoto.org/doc/ptpip.php][10]

[1]: http://en.wikipedia.org/wiki/Picture_Transfer_Protocol
[2]: http://en.wikipedia.org/wiki/Ricoh
[3]: mailto:felix.klee@inka.de
[4]: http://mobilehackerz.jp/contents/Review/RICOH_THETA
[5]: http://www.wtfpl.net/txt/copying/
[6]: http://mobilehackerz.jp/contents?plugin=attach&pcmd=info&file=ThetaShutter_PQIAirPen002.zip&refer=Review%2FRICOH_THETA%2FRemote
[7]: http://requirejs.org/
[8]: https://developer.mozilla.org/en-US/docs/WebAPI/TCP_Socket
[9]: http://people.ece.cornell.edu/land/courses/ece4760/FinalProjects/f2012/jmv87/site/files/pima15740-2000.pdf
[10]: http://www.gphoto.org/doc/ptpip.php
