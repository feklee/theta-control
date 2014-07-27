/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    'util', 'battery-meter', 'ptp.js/ptp'
], function (util, batteryMeter, ptp) {
    'use strict';

    var maintainConnection, onNoConnection = util.nop,
        onConnected = util.nop, isConnected = false,
        onConnectFailure, onConnectSuccess, connectStage1, connectStage2,
        connectStage3,
        maintenanceInterval = 500; // ms

    onConnectFailure = function () {
        isConnected = false;
        onNoConnection();
    };

    onConnectSuccess = function () {
        isConnected = true;
        onConnected();
    };

    connectStage3 = function () {
        batteryMeter.update({
            onSuccess: onConnectSuccess,
            onFailure: onConnectFailure
        });
    };

    // Bringing date and time after connection up to date seems a good idea.
    connectStage2 = function () {
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
        ptp.host = '192.168.1.1';
        ptp.onDisconnected = onConnectFailure;
        ptp.onConnected = connectStage2;
        ptp.clientName = 'Theta Control';
        ptp.connect(); // tolerates being called in quick succession
    };

    maintainConnection = function () {
        if (!ptp.isConnected) {
            connectStage1();
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
