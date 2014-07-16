/*jslint browser: true, maxerr: 50, maxlen: 80 */

(function () {
    'use strict';

    // Workaround for: https://bugzilla.mozilla.org/show_bug.cgi?id=1038760
    window.setCaptureButtonHeight = function () {
        var el = document.querySelector('.capture.button');
        el.style.height = (window.innerHeight - 12) + 'px';
    };

    window.setCaptureButtonHeight();
}());
