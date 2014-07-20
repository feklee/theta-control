/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['ptp.js/ptp'], function (ptp) {
    'use strict';

    var update, setClassName, needsUpdate, timeOfLastUpdate,
        lifeTime = 60000; // ms

    setClassName = function (options) {
        var level = options.dataPacket.getWord(0),
            el = document.querySelector('dd.battery-meter');

        // Theta only returns a few discrete values (firmware v1.30):
        if (level >= 67) {
            el.className = 'high';
        } else if (level >= 33) {
            el.className = 'medium';
        } else {
            el.className = 'low';
        }

        el.className += ' battery-meter';
    };

    // Note: The battery meter update process and a capture should not run
    // simultaneously, since the Theta seems to have problems processing
    // concurrent PTP/IP commands. (After the latest update of ptp.js, this
    // assertion could be re-evaluated.)
    update = function (options) {
        ptp.getDeviceProperty({
            code: ptp.devicePropCodes.batteryLevel,
            onSuccess: function (options2) {
                setClassName(options2);
                options.onSuccess();
                timeOfLastUpdate = new Date().getTime(); // ms
            },
            onFailure: options.onFailure
        });
    };

    needsUpdate = function () {
        var currentTime = new Date().getTime(); // ms
        return (timeOfLastUpdate === undefined ||
                currentTime - timeOfLastUpdate > lifeTime);
    };

    return Object.create(null, {
        needsUpdate: {get: function () {
            return needsUpdate();
        }},
        update: {value: update}
    });
});
