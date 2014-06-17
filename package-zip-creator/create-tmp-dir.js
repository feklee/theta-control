/*jslint node: true, maxerr: 50, maxlen: 80, nomen: true, unparam: true */

'use strict';

module.exports = function (settings) {
    require('tmp').dir(function (err, path) {
        if (err) {
            return settings.onError(err);
        }

        settings.onSuccess(path);
    });
};
