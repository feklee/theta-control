// Utility functionality.
//
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

    // Counts down from `p.from` ms to zero calling `p.onCount` for every
    // count, and in the end: `p.onZero`. Once the `p.interrupt` function
    // returns false, then the countdown stops.
    countdown = function (p, startTime) {
        var increment = 100, // ms
            elapsedTime,
            currentTime = new Date().getTime();

        if (p.interrupt()) {
            return;
        }

        if (startTime === undefined) {
            startTime = currentTime;
        }

        elapsedTime = currentTime - startTime;

        if (elapsedTime > p.from) {
            p.onZero();
        } else {
            p.onCount(p.from - elapsedTime);
            setTimeout(function () {
                countdown(p, startTime);
            }, increment);
        }
    };

    return Object.create(null, {
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

        countdown: {value: countdown}
    });
});
