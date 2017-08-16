/**
 * Created by wisemonkey on 8/15/2017.
 */
/*
 Simple Serial Server
 using servi.js and p5.js
 To call this type the following on the command line:
 node index.js portName
 where portname is the name of your serial port, e.g. /dev/tty.usbserial-xxxx (on OSX)
 created 19 Sept 2014
 modified 17 Mar 2015
 by Tom Igoe
 */
// var SerialPort = require('serialport');
// var portName = process.argv[2];            // get port name from the command line

var serialData = 0;                    // latest data saved from the serial port

var express = require('express');
var app = express();

app.use('/data', express.static('public'))


app.listen(8080);
//
// var Port = new SerialPort(portName, {
//     baudRate: 9600,
//     parser: SerialPort.parsers.readline('\r\n')
// });
//
//
// // these are the definitions for the serial events:
// Port.on('open', showPortOpen);
// Port.on('data', saveLatestData);
// Port.on('close', showPortClose);
// Port.on('error', showError);
//
// // these are the functions called when the serial events occur:
// function showPortOpen() {
//     console.log('port open. Data rate: ' + Port.options.baudRate);
// }
//
// function saveLatestData(data) {
//     console.log(data);
//     serialData = data;
// }
//
// function showPortClose() {
//     console.log('port closed.');
// }
//
// function showError(error) {
//     console.log('Serial port error: ' + error);
// }

// ------------------------ Server function
function sendData(request) {
    // print out the fact that a client HTTP request came in to the server:
    console.log("Got a client request, sending them the data.");
    // respond to the client request with the latest serial string:
    app.serveFiles('public');
    //request.respond(serialData);
}