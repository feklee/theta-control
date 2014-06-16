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
                    'dd.exposure-settings input:checked'
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
