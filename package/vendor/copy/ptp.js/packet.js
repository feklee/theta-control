// Copyright 2014 Developers of ptp.js
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

define(['./data-factory'], function (dataFactory) {
    'use strict';

    var types, cmdRequest, startDataPacket, writeHeader,
        headerLength = 8, transactionId = 0;

    types = {
        cmdRequest: 6,
        startDataPacket: 9
    };

    writeHeader = function (data, type) {
        data.writeDword(0, data.length);
        data.writeDword(4, type);
    };

    cmdRequest = function (commandCode, args) {
        var data = dataFactory.create();

        data.writeDword(headerLength, 1);
        data.appendWord(commandCode);
        data.appendDword(transactionId);

        if (args !== undefined) {
            args.forEach(function (arg) {
                data.appendDword(arg);
            });
        }

        writeHeader(data, types.cmdRequest);

        return data;
    };

    startDataPacket = function (size) {
        var data = dataFactory.create();

        data.writeDword(headerLength, transactionId);
        data.appendDword(size);
        data.appendDword(0);

        writeHeader(data, types.cmdRequest);

        return data;
    };

    return Object.create(null, {
        cmdRequest: {value: cmdRequest},
        startDataPacket: {value: startDataPacket},
        startNewTransaction: {value: function () { transactionId += 1; }}
    });
});

// TODO: remove?
