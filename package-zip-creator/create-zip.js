/*jslint node: true, maxerr: 50, maxlen: 80, nomen: true, unparam: true */

'use strict';

module.exports = function (settings) {
    var fs = require('fs'),
        archiver = require('archiver'),
        archive = archiver('zip'),
        zipPath = settings.optimizedPackagePath + '.zip',
        output;

    output = fs.createWriteStream(zipPath);

    output.on('close', function () {
        settings.onSuccess(zipPath);
    });
    archive.on('error', settings.onError);

    archive.pipe(output);
    archive.bulk([
        { expand: true, cwd: settings.optimizedPackagePath, src: ['**']}
    ]);
    archive.finalize();
};
