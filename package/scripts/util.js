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

    // Counts down from `options.from` ms to zero calling `options.onCount` for
    // every count, and in the end: `options.onZero`. Once the
    // `options.interruptRequested` function returns true, then the countdown
    // stops, calling `options.onInterrupt`.
    countdown = function (options, startTime) {
        var increment = 100, // ms
            elapsedTime, // ms
            currentTime = new Date().getTime(); // ms

        if (options.interruptRequested()) {
            options.onCount(0);
            options.onInterrupt();
            return;
        }

        if (startTime === undefined) {
            startTime = currentTime;
        }

        elapsedTime = currentTime - startTime;

        if (elapsedTime >= options.from) {
            options.onCount(0);
            options.onZero();
        } else {
            options.onCount(options.from - elapsedTime);
            setTimeout(function () {
                countdown(options, startTime);
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
