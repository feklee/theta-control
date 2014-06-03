// Copyright 2014 Felix E. Klee <felix.klee@inka.de>
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    'util',
    'exposure-settings',
    'intervalometer-settings',
    '../vendor/ptp.js/ptp'
], function (util, exposureSettings, intervalometerSettings, ptp) {
    'use strict';

    var captureExposures,
        formattedSeconds,
        setStatus,
        stopRequested = false,
        stop,
        onNoConnection,
        onStopped,
        interruptCountdown,
        nExposures = 0;

    setStatus = onStopped = function () {
        return;
    };

    onNoConnection = function () {
        stop();
        setStatus({
            msg: 'No connection to Theta',
            isError: true
        });
    };

    formattedSeconds = function (x) {
        return x.toFixed(1);
    };

    captureExposures = function (shifts) {
        var shiftsHaveBeenCaptured,
            delay;

        if (shifts === undefined || shifts.length === 0) {
            shifts = exposureSettings.selectedShifts;
        }

        ptp.setExposureBiasCompensation(shifts.shift());
        ptp.capture();
        setStatus({
            type: 'summary',
            msg: 'Exposures: ' + nExposures
        });
        nExposures += 1;

        shiftsHaveBeenCaptured = shifts.length === 0;

        if ((shiftsHaveBeenCaptured && !intervalometerSettings.isEnabled) ||
                stopRequested) {
            stop();
            return;
        }

        delay = (shiftsHaveBeenCaptured ?
                 1000 * intervalometerSettings.delay :
                 5000);
        interruptCountdown = false;
        util.countdown({
            from: delay,
            onCount: function (remainingTime) {
                setStatus(formattedSeconds(remainingTime / 1000));
            },
            onZero: function () {
                setStatus('');
                captureExposures(shifts);
            },
            interrupt: function () {
                return interruptCountdown;
            }
        });
    };

    stop = function () {
        interruptCountdown = true;
        onStopped();
        stopRequested = false;
        setStatus('');
    };

    return Object.create(null, {
        start: {value: function () {
            setStatus('');

            ptp.onNoConnection = onNoConnection;
            ptp.ip = '192.168.1.1';
            ptp.connectIfNecessary(function () {
                var lock = navigator.requestWakeLock('wifi');
                captureExposures();
                lock.unlock();
            });
        }},

        stop: {value: stop},

        setStatus: {set: function (f) {
            setStatus = f;
        }},

        onStopped: {set: function (f) {
            onStopped = f;
        }}
    });
});
