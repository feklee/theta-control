/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['util', 'ptp.js/ptp'], function (util, ptp) {
    'use strict';

    var update, run, setClassName, requestStart, requestStop, onStop,
        stopRequested = false,
        isRunning = false,
        loopInterval = 1000; // ms

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

    update = function (settings) {
        console.log('upd', settings.onDone);

        ptp.getDeviceProperty({
            code: ptp.devicePropCodes.batteryLevel,
            onSuccess: function (settings2) {
                setClassName(settings2);
                settings.onDone();
            },
            onFailure: settings.onDone
        });
    };

    onStop = function () {
        isRunning = false;
        stopRequested = false;
    };

    run = function () {
        var scheduleNextUpdate = function () {
            setTimeout(run, loopInterval);
        };

        console.log('run1');

        if (stopRequested) {
            console.log('stoprequested');
            onStop();
            return;
        }

        console.log('run2');
        isRunning = true;
        update({
            onDone: scheduleNextUpdate
        });
    };

    requestStart = function () {
        stopRequested = false;

        console.log('req start');

        if (isRunning) {
            console.log('isRunning');
            return;
        }

        run();
    };

    requestStop = function () {
        stopRequested = true;
    };

    return Object.create(null, {
        requestStart: {value: requestStart},
        requestStop: {value: requestStop}
    });
});
