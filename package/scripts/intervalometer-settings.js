/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define, Uint8Array */

define(['util'], function (util) {
    'use strict';

    var updateSettings, isEnabled, delay, onChanged = util.nop;

    isEnabled = function () {
        return document.querySelector('#intervalometer').checked;
    };

    // in seconds
    delay = function () {
        return document.querySelector('dd.intervalometer-settings input').value;
    };

    updateSettings = function () {
        document.querySelector('dd.intervalometer-settings > div').style.
            marginTop = isEnabled() ? '0' : '-24px';
        onChanged();
    };

    util.onceDocumentIsInteractive(function () {
        updateSettings();
        document.querySelector('#intervalometer').
            addEventListener('change', updateSettings);
    });

    return Object.create(null, {
        delay: {get: function () {
            return delay();
        }},
        onChanged: {set: function (f) {
            onChanged = f;
        }},

        isEnabled: {get: isEnabled}
    });
});
