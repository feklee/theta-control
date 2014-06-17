/*jslint node: true, maxerr: 50, maxlen: 80, nomen: true, unparam: true */

'use strict';

module.exports = function (settings) {
    var fs = require('fs'),
        htmlPath = settings.optimizedPackagePath + '/app.html';

    fs.readFile(htmlPath, 'utf8', function (err, data) {
        if (err) {
            return settings.onError(err);
        }

        data = data.replace(new RegExp(
            '<!--\\s*\\[remove-in-production\\]\\s*-->' +
                '(.|\\s)*' +
                '<!--\\s*\\[/remove-in-production\\]\\s*-->',
            'mg'
        ), '');

        data = data.replace(new RegExp(
            '<!--\\s*\\[insert-script-in-production\\s*/\\]\\s*-->',
            'mg'
        ), '<script src="scripts/app.js"></script>');

        fs.writeFile(htmlPath, data, 'utf8', function (err) {
            if (err) {
                return settings.onError(err);
            }

            settings.onSuccess(settings.optimizedPackagePath);
        });
    });
};
