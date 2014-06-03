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

define(['util', 'capture'], function (util, capture) {
    'use strict';

    var setStatus, setFunction, start, onStopped;

    setStatus = function (status) {
        var statusEl;

        if (typeof status === 'string') {
            status = {msg: status, isError: false};
        }

        if (status.type === undefined) {
            status.type = 'momentary';
        }

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

    start = function () {
        setFunction('stop');
        capture.start();
    };

    onStopped = function () {
        setFunction('start');
    };

    setFunction = function (type) {
        var text, onClick;

        switch (type) {
        case 'start':
            text = 'Capture';
            onClick = start;
            break;
        case 'stop':
            text = 'Stop';
            onClick = capture.stop;
            break;
        }

        document.querySelector('.capture.button').onclick = onClick;
        document.querySelector('.capture.button .function').textContent = text;
    };

    util.onceDocumentIsInteractive(function () {
        capture.setStatus = setStatus;
        capture.onStopped = onStopped;
        setFunction('start');
    });
});
