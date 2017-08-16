/**

 * Created by wisemonkey on 8/15/2017.
 */
require("wise-helper");
require('wise-helper');
var five = require("johnny-five"), servo, board;
var Timer = require('clockmaker').Timer,
    Timers = require('clockmaker').Timers;
const WebSocket = require('ws').Server;
var parser;
var portName = process.argv[2];
var SerialPort = require('serialport');
//var Readline = SerialPort.parsers.Readline();
var port = new SerialPort(portName,{
    baudRate: 9600
});

 parser = new SerialPort.parsers.Readline();

var range = 180;
var center = range/2;
var ON;
var OFF;
var PORT = 8081;


const wss = new WebSocket({ port: PORT });
var connections = new Array;


SerialPort.list(function (err, ports) {
    ports.forEach(function(port) {
        console.log(port.comName);
    });
});


port.pipe(parser);
var servo = function () {
    this.val = 0;
    this.moveto = function (pos) {
        print(pos);
    }

    this.show = function () {
        print(this.val);
    }
}

function moveto(pos){
}

function serialParse(input){

}



function showPortOpen() {
    console.log('port open. Data rate: ' + port.baudRate);
}

function sendSerialData(data) {


    console.log(data);


}

function sendToSerial(data) {
    console.log("sending to serial: " + data);
    port.write(data);
}

function showPortClose() {
    console.log('port closed.');
}

function showError(error) {
    console.log('Serial port error: ' + error);
}
function ledOn() {
    port.write("1");
    clearInterval(ON);
}
function ledOff() {
    port.write("0");
    clearInterval(OFF);
}
function setupSerial() {

    parser.on('data', console.log);
    parser.on('open', showPortOpen);

    parser.on('data', sendSerialData);
    parser.on('close', showPortClose);
    parser.on('error', showError);

}
var timer = new Timer(function() {
    if (timer.getNumTicks()%2 ===0) {
        ledOn();
    }else {
        ledOff()
    }
    console.log('On 1 sec');
}, 1000, {
    repeat: true
});


function broadcast(data) {
    for (myConnection in connections) {   // iterate over the array of connections
        connections[myConnection].send(data); // send the data to each connection
    }
}

function saveLatestData(data) {
    console.log(data);
    // if there are webSocket connections, send the serial data
    // to all of them:
    if (connections.length > 0) {
        broadcast(data);
    }
}
wss.on('connection', handleConnection);

function handleConnection(client) {
    print('Client Connected!');
    console.log("New Connection"); // you have a new client
    connections.push(client); // add this client to the connections array

    client.on('message', sendToSerial); // when a client sends a message,
    client.on('message', saveLatestData); // when a client sends a message,

    client.on('close', function() { // when a client closes its connection
        console.log("connection closed"); // print it out
        var position = connections.indexOf(client); // get the client's position in the array
        connections.splice(position, 1); // and delete it from the array
    });
}
//timer.start();


var servo1 =  new servo();

var servo2 =  new servo();




print('Server Running!  (Arguments) PORT : ' + portName);





/*




 moveto(center);

 readConsole(function(){

 var pos =  serialParse(input);

 moveto(pos);

 }*/
