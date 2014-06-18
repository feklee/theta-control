/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    'util', 'exposure-settings', 'intervalometer-settings', 'volume-settings',
    'ptp.js/ptp'
], function (util, exposureSettings, intervalometerSettings, volumeSettings,
             ptp) {
    'use strict';

    var run, capture, captureStage1, captureStage2, captureStage3,
        onCaptureSuccess, lastShift, lastVolume,
        isRunning = false,
        stopRequested = false,
        requestStart,
        requestStop,
        capturingLastBracketingShot = false,
        onStopRequested = util.nop,
        onStopped = util.nop,
        onCaptureStarted = util.nop,
        onCaptureFinished = util.nop,
        onCount = util.nop,
        numberOfShots = 0;

    captureStage3 = function (settings) {
        ptp.capture({
            storageId: 0,
            objectFormatCode: 0,
            onSuccess: function () {
                numberOfShots += 1;
                settings.onSuccess();
            },
            onFailure: function () {
                settings.onFailure();
            }
        });
    };

    captureStage2 = function (settings) {
        if (settings.shift === lastShift) {
            captureStage3(settings);
        } else {
            lastShift = settings.shift;
            ptp.setDeviceProperty({
                code: ptp.devicePropCodes.exposureBiasCompensation,
                data: ptp.dataFactory.createWord(settings.shift),
                onSuccess: function () {
                    captureStage3(settings);
                },
                onFailure: settings.onFailure
            });
        }
    };

    captureStage1 = function (settings) {
        var volume = volumeSettings.volume;

        if (volume === lastVolume) {
            captureStage2(settings);
        } else {
            lastVolume = volume;
            ptp.setDeviceProperty({
                code: 0x502c,
                data: ptp.dataFactory.createDword(volume),
                onSuccess: function () {
                    captureStage2(settings);
                },
                onFailure: settings.onFailure
            });
        }
    };

    capture = function (settings) {
        onCaptureStarted({
            shift: settings.shift
        });

        captureStage1({
            shift: settings.shift,
            onSuccess: function () {
                onCaptureFinished();
                settings.onSuccess();
            },
            onFailure: function () {
                onCaptureFinished();
                settings.onFailure();
            }
        });
    };

    onCaptureSuccess = function (settings) {
        var delay, bracketingIsDone = settings.shifts.length === 0;

        if (stopRequested) {
            settings.onStop();
            return;
        }

        if (bracketingIsDone) {
            if (!intervalometerSettings.isEnabled) {
                settings.onStop();
                return;
            }
            delay = 1000 * intervalometerSettings.delay;
        } else {
            delay = 0;
        }

        util.countdown({
            from: delay,
            onCount: onCount,
            onZero: function () {
                run(settings);
            },
            interruptRequested: function () {
                return stopRequested;
            },
            onInterrupt: settings.onStop
        });
    };

    run = function (settings) {
        var shift;

        isRunning = true;
        if (settings.shifts === undefined || settings.shifts.length === 0) {
            settings.shifts = exposureSettings.selectedShifts;
        }

        shift = settings.shifts.shift();
        capturingLastBracketingShot = (settings.shifts.length === 0);
        capture({
            shift: shift,
            onSuccess: function () {
                capturingLastBracketingShot = false;
                onCaptureSuccess(settings);
            },
            onFailure: function () {
                capturingLastBracketingShot = false;
                settings.onStop();
            }
        });
    };

    requestStart = function () {
        var lock;

        if (isRunning) {
            return;
        }

        if (navigator.requestWakeLock === undefined) {
            return; // not supported
        }

        lock = navigator.requestWakeLock('wifi');

        stopRequested = false;
        run({onStop: function () {
            isRunning = false;
            onStopped();
            lock.unlock();
        }});
    };

    requestStop = function () {
        if (isRunning) {
            stopRequested = true;
            onStopRequested();
        } else {
            onStopRequested();
            onStopped();
        }
    };

    return Object.create(null, {
        requestStart: {value: requestStart},
        requestStop: {value: requestStop},
        onStopRequested: {set: function (f) {
            onStopRequested = f;
        }},
        onStopped: {set: function (f) {
            onStopped = f;
        }},
        onCaptureStarted: {set: function (f) {
            onCaptureStarted = f;
        }},
        onCaptureFinished: {set: function (f) {
            onCaptureFinished = f;
        }},
        onCount: {set: function (f) {
            onCount = f;
        }},
        isRunning: {get: function () {
            return isRunning;
        }},
        stopRequested: {get: function () {
            return stopRequested;
        }},
        capturingLastBracketingShot: {get: function () {
            return capturingLastBracketingShot;
        }},
        numberOfShots: {get: function () {
            return numberOfShots;
        }}
    });
});
