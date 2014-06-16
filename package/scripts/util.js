/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(function () {
    'use strict';

    var documentIsComplete, documentIsInteractive, countdown;

    // Return true once document has loaded, incl. sub-resources.
    documentIsComplete = function () {
        return document.readyState === 'complete';
    };

    // Returns true once document is finished parsing but possibly still
    // loading sub-resources.
    documentIsInteractive = function () {
        // Note that Android 2.3.5's standard browser uses `"loaded"` in place
        // of `"interactive"` as value for `readyState`. For discussion, see:
        //
        // <url:http://stackoverflow.com/questions/13348029/
        // values-for-document-readystate-in-android-2-3-browser>

        return (document.readyState === 'interactive' ||
                document.readyState === 'loaded' ||
                documentIsComplete());
    };

    // Counts down from `settings.from` ms to zero calling `settings.onCount`
    // for every count, and in the end: `settings.onZero`. Once the
    // `settings.interruptRequested` function returns true, then the countdown
    // stops, calling `settings.onInterrupt`.
    countdown = function (settings, startTime) {
        var increment = 100, // ms
            elapsedTime, // ms
            currentTime = new Date().getTime(); // ms

        if (settings.interruptRequested()) {
            settings.onCount(0);
            settings.onInterrupt();
            return;
        }

        if (startTime === undefined) {
            startTime = currentTime;
        }

        elapsedTime = currentTime - startTime;

        if (elapsedTime >= settings.from) {
            settings.onCount(0);
            settings.onZero();
        } else {
            settings.onCount(settings.from - elapsedTime);
            setTimeout(function () {
                countdown(settings, startTime);
            }, increment);
        }
    };

    return Object.create(null, {
        // Runs `onDocumentIsComplete` once document has loaded (incl.
        // sub-resources).
        onceDocumentIsComplete: {value: function (onDocumentIsComplete) {
            if (document.readyState === 'interactive' ||
                    document.readyState === 'complete') {
                onDocumentIsComplete();
            } else {
                window.addEventListener('load', onDocumentIsComplete, false);
            }
        }},

        // Runs `onDocumentIsInteractive` once document is finished parsing but
        // still loading sub-resources.
        onceDocumentIsInteractive: {value: function (onDocumentIsInteractive) {
            if (documentIsInteractive()) {
                onDocumentIsInteractive();
            } else {
                // `document.onreadystatechange` is not used as it doesn't fire
                // in Android 2.3.5's standard browser:
                //
                // <url:http://stackoverflow.com/questions/13346746/
                // document-readystate-on-domcontentloaded>
                window.addEventListener('DOMContentLoaded',
                                        onDocumentIsInteractive, false);
            }
        }},

        clear: {value: function (el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        }},

        // Returns position of element on viewport, in pixels.
        viewportPos: {value: function (el) {
            var rect = el.getBoundingClientRect();
            return [rect.left, rect.top];
        }},

        countdown: {value: countdown},

        nop: {value: function () {
            return;
        }}
    });
});
