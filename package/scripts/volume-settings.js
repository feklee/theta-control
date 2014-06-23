/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['util'], function (util) {
    'use strict';

    var getVolume, getInputEl, updateIndicator,
        maxWidth; // px

    getInputEl = function () {
        return document.querySelector('dd.volume-settings input');
    };

    getVolume = function () {
        return getInputEl().value;
    };

    updateIndicator = function () {
        var style;
        if (maxWidth === undefined) {
            return;
        }
        style = document.querySelector('dd.volume-settings .indicator').style;
        style.width =
            Math.round((getVolume() / 100) * maxWidth) + 'px';
    };

    util.onceDocumentIsInteractive(function () {
        var inputEl = getInputEl();
        inputEl.oninput = updateIndicator;
    });

    util.onceDocumentIsComplete(function () {
        maxWidth = parseInt(window.getComputedStyle(getInputEl()).width, 10);
        updateIndicator();
    });

    return Object.create(null, {
        volume: {get: getVolume}
    });
});
