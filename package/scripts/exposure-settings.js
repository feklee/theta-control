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

    return Object.create(null, {
        // Returns selected exposure shifts relative to EV, scaled by 1000. If
        // nothing is selected, returns `[0]`.
        selectedShifts: {get: function () {
            var i, shifts = [], shift,
                nodes = document.querySelectorAll(
                    'dd.exposures input:checked'
                );

            for (i = 0; i < nodes.length; i += 1) {
                shift = parseInt(nodes[i].value, 10);
                if (shift === 0) {
                    shifts.unshift(shift); // EV+0 is given highest priority
                } else {
                    shifts.push(shift);
                }
            }

            if (shifts.length === 0) {
                shifts = [0];
            }

            return shifts;
        }}
    });
});
