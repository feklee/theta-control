// Generates blocks of data with functions for manipulation.
//
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

/*global define, Uint8Array */

define(function () {
    'use strict';

    var create, writeLittleEndian, appendDword, appendWord, writeDword;

    writeLittleEndian = function (data, offs, value, nBytes) {
        var i;
        for (i = 0; i < nBytes; i += 1) {
            /*jslint bitwise: true */
            data[offs + i] = (value >> (8 * i)) & 0xff;
            /*jslint bitwise: false */
        }
    };

    appendDword = function (arr, value) {
        writeLittleEndian(arr, arr.length, value, 4);
    };

    appendWord = function (arr, value) {
        writeLittleEndian(arr, arr.length, value, 2);
    };

    writeDword = function (arr, offs, value) {
        writeLittleEndian(arr, offs, value, 4);
    };

    create = function () {
        var arr = [];

        return Object.create(null, {
            appendDword: {value: function (value) {
                appendDword(arr, value);
            }},

            appendWord: {value: function (value) {
                appendWord(arr, value);
            }},

            writeDword: {value: function (offs, value) {
                writeDword(arr, offs, value);
            }},

            length: {get: function () {
                return arr.length;
            }},

            buffer: {get: function () {
                return (new Uint8Array(arr)).buffer;
            }},

            toString: {value: function () {
                return arr.toString();
            }}
        });
    };

    return Object.create(null, {
        create: {value: create}
    });
});
