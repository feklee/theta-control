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

/*global define, Uint8Array */

define(['util'], function (util) {
    'use strict';

    var updateSettings, isEnabled;

    isEnabled = function () {
        return document.querySelector('#intervalometer').checked;
    };

    updateSettings = function () {
        document.querySelector('dd.intervalometer > div').style.marginTop =
            isEnabled() ? '0' : '-24px';
    };

    util.onceDocumentIsInteractive(function () {
        updateSettings();
        document.querySelector('#intervalometer').
            addEventListener('change', updateSettings);
    });

    return Object.create(null, {
        // in seconds
        delay: {get: function () {
            return document.querySelector('dd.intervalometer input').value;
        }},

        isEnabled: {get: isEnabled}
    });
});
