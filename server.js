/**
 * Created by wisemonkey on 8/15/2017.
 */
require('wise-helper');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var SerialPort = require('serialport');

app.use(express.static('public'));

var portName = process.argv[2];
var port = 80;

if (typeof portName === "undefined") {
    console.error("You need to specify the serial port when you launch this script, like so:\n");
    console.error("    node server.js <portname>");
    console.error("\n Fill in the name of your serial port in place of <portname> \n");
    portName = '/dev/ttyACM0';
    // process.exit(1);
}




var arduino = new SerialPort(portName, {                           // serial communication options
    baudRate: 9600,
    parser: SerialPort.parsers.readline('\r\n')
});


arduino.on('open', function(){
    console.log('Serial Port : Open, Using Baud Rate : ' + arduino.options.baudRate);
    console.log('Localhost:'+  port);
    io.on('connection', function (socket) {
        print("Client Connected");

        socket.on('slider', function (data) {
            if(data){
                print(data.servo1 + ', ' +data.servo2 + ', ' +data.servo3);
                // if(data.servo1 > 90) {
                //     arduino.write('1', function () {
                //         print("LED : On");
                //     });
                // }else{
                //     arduino.write('0', function () {
                //         print("LED : Off");
                //     });
                // }
                arduino.write(data.servo1 + ',' + data.servo2 + ', ' +data.servo3  +'\n');
            }
        });
    });

});

arduino.on('data',function (data) {
   print("Serial Port : Receiving Data.",data)
});
    arduino.on('close',function(){
    print("Serial Port : Closed.");
});

arduino.on('error', function(error){
    console.error('Serial Port : ' + error);
});




server.listen(process.env.PORT || port);

print("Server Running: Arduino Servo Controller");
