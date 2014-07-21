/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    'util', 'battery-meter', 'ptp.js/ptp'
], function (util, batteryMeter, ptp) {
    'use strict';

    var maintainConnection, onNoConnection = util.nop,
        onConnected = util.nop, isConnected = false, isConnecting = false,
        onConnectFailure, onConnectSuccess, connectStage1, connectStage2,
        connectStage3,
        maintenanceInterval = 500; // ms

    onConnectFailure = function () {
        console.log('connect failure');
        isConnected = false;
        isConnecting = false;
        onNoConnection();
    };

    onConnectSuccess = function () {
        console.log('connect success');
        isConnected = true;
        isConnecting = false;
        onConnected();
    };

    connectStage3 = function () {
        console.log('connect stage 3');
        batteryMeter.update({
            onSuccess: onConnectSuccess,
            onFailure: onConnectFailure
        });
    };

    // Bringing date and time after connection up to date seems a good idea.
    connectStage2 = function () {
        console.log('connect stage 2');
        ptp.setDeviceProperty({
            code: ptp.devicePropCodes.dateTime,
            data: ptp.dataFactory.createWstring(
                ptp.dateTimeString({date: new Date()})
            ),
            onSuccess: connectStage3,
            onFailure: onConnectFailure
        });
    };

    connectStage1 = function () {
        console.log('connect stage 1');
        ptp.loggerOutputIsEnabled = true; // TODO: remove
        ptp.host = '192.168.1.1';
        ptp.onDisconnected = onConnectFailure;
        ptp.onConnected = connectStage2;
        ptp.clientName = 'Theta Control';
        ptp.connect();
    };

    maintainConnection = function () {
        if (!isConnecting) {
            if (!ptp.isConnected) {
                isConnecting = true;
                connectStage1();
            }
        }
        setTimeout(maintainConnection, maintenanceInterval);
    };

    util.onceDocumentIsInteractive(function () {
        maintainConnection();
    });

    return Object.create(null, {
        onNoConnection: {set: function (f) {
            onNoConnection = f;
        }},
        onConnected: {set: function (f) {
            onConnected = f;
        }},
        isConnected: {get: function () {
            return isConnected;
        }}
    });
});
