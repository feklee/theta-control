/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    'util', 'exposure-settings', 'intervalometer-settings', 'volume-settings',
    'battery-meter', 'reset', 'ptp.js/ptp'
], function (util, exposureSettings, intervalometerSettings, volumeSettings,
             batteryMeter, reset, ptp) {
    'use strict';

    var run, capture, captureStage1, captureStage2, captureStage3, onStop,
        captureStage4, onCaptureSuccess, lastShift, lastVolume, lock,
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

    captureStage4 = function (options) {
        ptp.capture({
            storageId: 0,
            objectFormatCode: 0,
            onSuccess: function () {
                numberOfShots += 1;
                options.onSuccess();
            },
            onFailure: function () {
                options.onFailure();
            }
        });
    };

    captureStage3 = function (options) {
        if (options.shift === lastShift) {
            captureStage4(options);
        } else {
            lastShift = options.shift;
            ptp.setDeviceProperty({
                code: ptp.devicePropCodes.exposureBiasCompensation,
                data: ptp.dataFactory.createWord(options.shift),
                onSuccess: function () {
                    captureStage4(options);
                },
                onFailure: options.onFailure
            });
        }
    };

    captureStage2 = function (options) {
        var volume = volumeSettings.volume;

        if (volume === lastVolume) {
            captureStage3(options);
        } else {
            lastVolume = volume;
            ptp.setDeviceProperty({
                code: 0x502c,
                data: ptp.dataFactory.createDword(volume),
                onSuccess: function () {
                    captureStage3(options);
                },
                onFailure: options.onFailure
            });
        }
    };

    captureStage1 = function (options) {
        if (batteryMeter.needsUpdate) {
            batteryMeter.update({
                onSuccess: function () {
                    captureStage2(options);
                },
                onFailure: options.onFailure
            });
        } else {
            captureStage2(options);
        }
    };

    capture = function (options) {
        onCaptureStarted({
            shift: options.shift
        });

        captureStage1({
            shift: options.shift,
            onSuccess: function () {
                onCaptureFinished();
                options.onSuccess();
            },
            onFailure: function () {
                onCaptureFinished();
                options.onFailure();
            }
        });
    };

    onCaptureSuccess = function (options) {
        var delay, bracketingIsDone = options.shifts.length === 0;

        if (stopRequested) {
            options.onStop();
            return;
        }

        if (bracketingIsDone) {
            if (!intervalometerSettings.isEnabled) {
                options.onStop();
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
                run(options);
            },
            interruptRequested: function () {
                return stopRequested;
            },
            onInterrupt: options.onStop
        });
    };

    run = function (options) {
        var shift;

        isRunning = true;
        if (options.shifts === undefined || options.shifts.length === 0) {
            options.shifts = exposureSettings.selectedShifts;
        }

        shift = options.shifts.shift();
        capturingLastBracketingShot = (options.shifts.length === 0);
        capture({
            shift: shift,
            onSuccess: function () {
                capturingLastBracketingShot = false;
                onCaptureSuccess(options);
            },
            onFailure: function () {
                capturingLastBracketingShot = false;
                options.onStop();
            }
        });
    };

    onStop = function () {
        isRunning = false;
        reset(function () {
            if (lock !== undefined) {
                lock.unlock();
            }
            onStopped();
        });
    };

    requestStart = function () {
        if (isRunning) {
            return;
        }

        if (navigator.requestWakeLock !== undefined) {
            lock = navigator.requestWakeLock('wifi');
        }

        // it's unknown what happened since last run => start with undefined:
        lastShift = undefined;
        lastVolume = undefined;

        stopRequested = false;
        run({onStop: onStop});
    };

    requestStop = function () {
        if (isRunning) {
            stopRequested = true;
            onStopRequested();
        } else {
            // may be superfluous
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
