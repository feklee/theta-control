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

define(['./packet', './data-factory'], function (packet, dataFactory) {
    'use strict';

    var send, capture, socket, setExposureBiasCompensation,
        connect, connectIfNecessary, onNoConnection,
        ip = '127.0.0.1',
        port = 15740,
        cmdRequest, packCommand,
        operationCodes, eventCodes, devicePropertyCodes;

    operationCodes = {
        openSession: 0x1002,
        closeSession: 0x1003,
        initiateCapture: 0x100E,
        setDevicePropValue: 0x1016
    };

    eventCodes = {
        objectAdded: 0x4002,
        captureComplete: 0x400D
    };

    devicePropertyCodes = {
        exposureBiasCompensation: 0x5010
    };

    onNoConnection = function () { return; };

    connect = function (onConnected) {
        if (!navigator.mozTCPSocket) {
            onNoConnection();
            return;
        }

        socket = navigator.mozTCPSocket.open(ip, port, {
            binaryType: 'arraybuffer'
        });

        socket.onopen = function () {
            var sessionId = 1; // TODO: retrieve from init ack

            // Init
            send([28, 0, 0, 0, 1, 0, 0, 0, 255, 255, 255, 255, 255,
                  255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
                  255, 1, 0, 0, 0]);

            // Open
            send([22, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0,
                  2, 16, 0, 0, 0, 0, 1, 0, 0, 0]);

            onConnected();
        };

        socket.onerror = onNoConnection;
        socket.onclose = onNoConnection;
    };

    connectIfNecessary = function (onConnected) {
        if (socket === undefined || socket.readyState !== 'open') {
            connect(onConnected);
        } else {
            onConnected();
        }
    };

    send = function (data) {
        socket.send((data instanceof Array) ?
                    new Uint8Array(data).buffer :
                    data.buffer);
    };

    capture = function () {
        packet.startNewTransaction();
        send(packet.cmdRequest(operationCodes.initiateCapture, [0, 0]));
    };

    // `shift` is in stops, scaled by a factor of 1000.
    setExposureBiasCompensation = function (shift) {
        return;

        packet.startNewTransaction();
        console.log(packet.cmdRequest(operationCodes.setDevicePropValue).
                    toString());
        console.log(packet.startDataPacket(2).toString());
        return;

        /*jslint bitwise: true */
        var sendCommand = [22, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 22, 16,
                           0, 0, 0, 0, 16, 80, 0, 0],
            startDataPacket = [20, 0, 0, 0,
                               9, 0, 0, 0,
                               0, 0, 0, 0,
                               2, 0, 0, 0,
                               0, 0, 0, 0],
            data = [14, 0, 0, 0,
                    12, 0, 0, 0,
                    0, 0, 0, 0,
                    shift & 0xff, (shift >> 8) & 0xff];

        writeDword(sendCommand, 14, transactionId);
        writeDword(startDataPacket, 8, transactionId);
        writeDword(data, 8, transactionId);

        send(sendCommand);
        send(startDataPacket);
        send(data);
        /*jslint bitwise: false */
    };

    return Object.create(null, {
        connectIfNecessary: {value: connectIfNecessary},
        capture: {value: capture},
        setExposureBiasCompensation: {value: setExposureBiasCompensation},
        onNoConnection: {set: function (x) {
            onNoConnection = x;
        }},
        ip: {set: function (x) {
            ip = x;
        }},
        port: {set: function (x) {
            port = x;
        }}
    });
});
