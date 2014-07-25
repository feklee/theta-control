/*jslint browser: true, maxerr: 50, maxlen: 80 */

(function () {
    'use strict';

    // Workaround for: https://bugzilla.mozilla.org/show_bug.cgi?id=1038760
    window.setCaptureButtonHeight = function () {
        var el = document.querySelector('.capture.button');
        el.style.height = (window.innerHeight - 12) + 'px';
    };

    window.setCaptureButtonHeight(); // on Firefox 32.0 / Android 4.2 this
                                     // fails because Firefox doesn't report
                                     // the correct window height when loading
                                     // => call again when document is loaded

    window.addEventListener('load', window.setCaptureButtonHeight, false);
}());
