/**
 * Created by wisemonkey on 8/15/2017.
 */
/*
 Serial-to-websocket Server
 using serialport.js

 To call this type the following on the command line:
 node wsServer.js portName

 where portname is the name of your serial port, e.g. /dev/tty.usbserial-xxxx (on OSX)

 created 28 Aug 2015
 by Tom Igoe

 */

// include the various libraries that you'll use:
// var serialport = require('serialport');       // include the serialport library
require('wise-helper');

var SerialPort = require('serialport');
var WebSocketServer = require('ws').Server;   // include the webSocket library

var express = require('express');
var app = express();

app.use('/data', express.static('public'));


app.listen(8080);
// configure the webSocket server:
var SERVER_PORT = 8081;                 // port number for the webSocket server
var wss = new WebSocketServer({port: SERVER_PORT}); // the webSocket server
var connections = new Array;            // list of connections to the server

// configure the serial port:
// SerialPort = serialport.SerialPort,             // make a local instance of serialport
//     portName = process.argv[2],                 // get serial port name from the commandvar line
//     delimiter = process.argv[3];                // serial parser to use, from command livarne
var    portName = process.argv[2];                 // get serial port name from the command line
var    delimiter = process.argv[3];                // serial parser to use, from command line
var serialOptions = {                           // serial communication options
    baudRate: 9600,                           // data rate: 9600 bits per second
    parser: delimiter // newline generates a data event
};


 // if the delimiter is n, use readline as the parser:
if (delimiter === 'n' ) {
    serialOptions.parser = SerialPort.parsers.readline('\r\n');
}


if (typeof delimiter === 'undefined') {
    serialOptions.parser = null;
}

// If the user didn't give a serial port name, exit the program:
if (typeof portName === "undefined") {
    console.error("You need to specify the serial port when you launch this script, like so:\n");
    console.error("    node server.js <portname>");
    console.error("\n Fill in the name of your serial port in place of <portname> \n");
    process.exit(1);
}
// open the serial port:
var myPort = new SerialPort(portName, serialOptions);

// set up event listeners for the serial events:
myPort.on('open', showPortOpen);
myPort.on('data', sendSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

// ------------------------ Serial event functions:
// this is called when the serial port is opened:
function showPortOpen() {
    console.log('port open. Data rate: ' + myPort.options.baudRate);
}

// this is called when new data comes into the serial port:
function sendSerialData(data) {
    // if there are webSocket connections, send the serial data
    // to all of them:
    //console.log(Number(data));
    //console.log(data);
    if (connections.length > 0) {
        broadcast(data);
    }
}

function showPortClose() {
    console.log('port closed.');
}
// this is called when the serial port has an error:
function showError(error) {
    console.log('Serial port error: ' + error);
}

function sendToSerial(data) {
    console.log("sending to serial: " + data);
    myPort.write(data);
}

// ------------------------ webSocket Server event functions
wss.on('connection', handleConnection);

function handleConnection(client) {
    console.log("New Connection");        // you have a new client
    connections.push(client);             // add this client to the connections array

    client.on('message', sendToSerial);      // when a client sends a message,
    client.on('servo1', function (data) {
       print(data);
    });
    client.on('close', function() {           // when a client closes its connection
        console.log("connection closed");       // print it out
        var position = connections.indexOf(client); // get the client's position in the array
        connections.splice(position, 1);        // and delete it from the array
    });
}
// This function broadcasts messages to all webSocket clients
function broadcast(data) {
    for (c in connections) {     // iterate over the array of connections
        connections[c].send(JSON.stringify(data)); // send the data to each connection
    }
}