/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['util', 'capture-button'], function (util) {
    'use strict';

    var updateArrow;

    updateArrow = function () {
        if (window.scrollY < 20) {
            setTimeout(updateArrow, 100);
        } else {
            document.querySelector('body', '::after').classList.
                add('sufficiently-scrolled');
        }
    };

    util.onceDocumentIsInteractive(function () {
        updateArrow();
    });
});
