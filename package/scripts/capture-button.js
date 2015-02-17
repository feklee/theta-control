/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    'util', 'capture-loop', 'intervalometer-settings', 'connection'
], function (util, captureLoop, intervalometerSettings, connection) {
    'use strict';

    var setStatus, start, onStopRequested, onStopped, onCaptureStarted,
        onCount, setMomentaryStatus, setSummaryStatus, formattedSeconds,
        onCaptureFinished, onIntervalometerSettingsChanged,
        formattedExposure, updateEnabledState, updateNoConnectionStatus,
        isDisabled = false,
        onClicked,
        type,
        labels,
        disable,
        enable,
        onKeyDown,
        setType;

    labels = { // by type
        start: 'Capture',
        stop: 'Stop'
    };

    formattedSeconds = function (x) {
        return x.toFixed(1);
    };

    formattedExposure = function (shift) {
        return ('EV' +
                (shift >= 0 ? '+' : '') +
                (shift / 1000).toFixed(shift % 1000 === 0 ? 0 : 1));
    };

    setStatus = function (status) {
        var statusEl;

        statusEl = document.querySelector('.capture.button ' +
                                          '.' + status.type +
                                          '.status');
        if (status.isError) {
            statusEl.classList.add('error');
        } else {
            statusEl.classList.remove('error');
        }
        statusEl.innerHTML = status.msg;
    };

    setMomentaryStatus = function (msg) {
        setStatus({type: 'momentary', msg: msg});
    };

    setSummaryStatus = function (msg) {
        setStatus({type: 'summary', msg: msg});
    };

    updateEnabledState = function () {
        if (intervalometerSettings.isEnabled) {
            if (captureLoop.isRunning && captureLoop.stopRequested) {
                disable();
            } else {
                enable();
            }
        } else {
            if (captureLoop.capturingLastBracketingShot) {
                // almost done, no stop button needed
                disable();
            } else {
                enable();
            }
        }
    };

    start = function () {
        setType('stop');
        setMomentaryStatus('');
        captureLoop.requestStart();
    };

    onStopRequested = function () {
        disable(); // no interaction until stopped
    };

    onStopped = function () {
        setType('start');
        updateNoConnectionStatus();
        updateEnabledState();
    };

    onClicked = function () {
        if (isDisabled || !connection.isConnected) {
            return;
        }

        switch (type) {
        case 'start':
            start();
            break;
        case 'stop':
            captureLoop.requestStop();
            break;
        }
    };

    disable = function () {
        isDisabled = true;
        document.querySelector('.capture.button').classList.add('disabled');
    };

    enable = function () {
        isDisabled = false;
        document.querySelector('.capture.button').classList.remove('disabled');
    };

    setType = function (x) {
        type = x;
        document.querySelector('.capture.button .label').textContent =
            labels[type];
    };

    onCaptureStarted = function (options) {
        setMomentaryStatus('Capturing ' + formattedExposure(options.shift));
        updateEnabledState();
        document.querySelector('.capture.button').classList.
            add('is-capturing');
    };

    onCaptureFinished = function () {
        setMomentaryStatus('');
        setSummaryStatus('Exposures: ' + captureLoop.numberOfShots);
        document.querySelector('.capture.button').classList.
            remove('is-capturing');
    };

    updateNoConnectionStatus = function () {
        if (!connection.isConnected) {
            setStatus({
                type: 'momentary',
                msg: 'No connection to Theta',
                isError: true
            });
        } // else: no change
    };

    connection.onNoConnection = function () {
        updateNoConnectionStatus();
        captureLoop.requestStop();
    };

    connection.onConnected = function () {
        setMomentaryStatus(''); // clears potential "no connection" error
    };

    onCount = function (remainingTime) {
        setMomentaryStatus(remainingTime === 0 ?
                           '' :
                           formattedSeconds(remainingTime / 1000));
    };

    onIntervalometerSettingsChanged = function () {
        updateEnabledState();
    };

    onKeyDown = function (e) {
        if (e.key === 'VolumeUp' || e.key === 'VolumeDown') {
            onClicked();
            e.preventDefault();
        }
    };

    intervalometerSettings.onChanged = onIntervalometerSettingsChanged;
    captureLoop.onStopRequested = onStopRequested;
    captureLoop.onStopped = onStopped;
    captureLoop.onCaptureStarted = onCaptureStarted;
    captureLoop.onCaptureFinished = onCaptureFinished;
    captureLoop.onCount = onCount;

    util.onceDocumentIsInteractive(function () {
        document.querySelector('.capture.button').onclick = onClicked;
        window.addEventListener('keydown', onKeyDown);
        setType('start');
        window.addEventListener('resize', window.setCaptureButtonHeight);
        updateNoConnectionStatus();
        updateEnabledState();
    });
});
