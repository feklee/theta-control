/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['ptp.js/ptp'], function (ptp) {
    'use strict';

    var update, setClassName, needsUpdate, timeOfLastUpdate,
        lifeTime = 60000; // ms

    setClassName = function (settings) {
        var level = settings.dataPacket.getWord(0),
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
    // simultaneously, since the Theta has problems processing concurrent
    // PTP/IP commands.
    update = function (settings) {
        ptp.getDeviceProperty({
            code: ptp.devicePropCodes.batteryLevel,
            onSuccess: function (settings2) {
                setClassName(settings2);
                settings.onSuccess();
                timeOfLastUpdate = new Date().getTime(); // ms
            },
            onFailure: settings.onFailure
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
