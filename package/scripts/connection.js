/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    'util', 'battery-meter-loop', 'ptp.js/ptp'
], function (util, batteryMeterLoop, ptp) {
    'use strict';

    var maintainConnection, onNoConnection = util.nop,
        onConnected = util.nop, isConnected = false, isConnecting = false,
        onConnectFailure, onConnectSuccess, connectStage1, connectStage2,
        maintenanceInterval = 500; // ms

    onConnectFailure = function () {
        isConnected = false;
        isConnecting = false;
        console.log('connectfailure');
        batteryMeterLoop.requestStop();
        onNoConnection();
    };

    onConnectSuccess = function () {
        isConnected = true;
        isConnecting = false;
        console.log('connectsuccess');
        batteryMeterLoop.requestStart();
        onConnected();
    };

    connectStage2 = function () {
        console.log('constage2');
        // Brings date & time up to date before finishing connection process:
        ptp.setDeviceProperty({
            code: ptp.devicePropCodes.dateTime,
            data: ptp.dataFactory.createWstring(
                ptp.dateTimeString({date: new Date()})
            ),
            onSuccess: onConnectSuccess,
            onFailure: onConnectFailure
        });
    };

    connectStage1 = function () {
        ptp.ip = '192.168.1.1';
        ptp.onNoConnection = onConnectFailure;
        ptp.onConnected = connectStage2;
        ptp.clientName = 'Theta Control';
        ptp.loggerOutputIsEnabled = true; // TODO
        ptp.connect();
    };

    maintainConnection = function () {
        console.log('maintain');
        if (!isConnecting) {
            isConnecting = true;
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
