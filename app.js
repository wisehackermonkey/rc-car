/**
 * Created by wisemonkey on 8/12/2017.
 */
// https://github.com/dgmd/johnny-five-express-sample
//http://johnny-five.io/
//https://github.com/rwaldron/johnny-five/blob/master/docs/servo.md
require('wise-helper');

var express = require('express');

var five = require("johnny-five"),motor,servo,led;

board = new five.Board({port:'COM3'});

var clientport = 80;
var port = 3000;
var addr = 'localhost';
var app;

var motorPin = 9;
var servoPin = 10;
var ledPin = 11;



board.on("ready", function() {
    motor = new five.Servo({
        pin: motorPin,
        center: true      // overrides startAt if true and moves the servo to the center of the range
    });
    servo = new five.Servo({
            pin: servoPin,
           // range: [0, 80],    // Default: 0-180
            //fps: 500,          // Used to calculate rate of movement between positions
            startAt: 90,       // Immediately move to a degree
            //center: true      // overrides startAt if true and moves the servo to the center of the range
        });

    led   = new five.Led(ledPin);

    print("Arduino READY!");
    app = express();


    function motorSpeed( speed, delay) {
        var motorSpeed  = speed;

       // var mappedSpeed = Math.ceil( motorSpeed.map(-1,1,0,180) );

        var msg = "Motor Speed : " + motorSpeed;// + ", Mapped : " + mappedSpeed + ", Delay : " + delay;


        motor.to(motorSpeed);
        print(`MotorSPEED : ${motorSpeed}`);
        board.wait(delay, function(){
            motor.stop();
            motor.center();
            print("Motor Speed : Stop");
        });

        //print(msg);
        return msg;
    }

    function move(speed,angle,distance) {
        // var speed = parseFloat(request.params.speed);
        // var angle = parseFloat(request.params.angle);
        // var distance = parseInt(request.params.distance);



        var distanceMapped = parseInt(distance);
        if (speed === 'stop') {
            print("WORKED!",speed)
            motor.stop();
            motor.center();
        }

        if (!(speed === 'undefined')) {
            var speedMapped = parseFloat(speed);
            speedMapped = Math.ceil(speedMapped.map(-100, 100, 0, 180));

            motorSpeed(speedMapped, distanceMapped);
            // print('set speed');
        }

        if (!(angle === 'undefined')) {
            var angleMapped = parseInt(angle);
            var mappedAngle = Math.ceil(angleMapped.map(0, 180, 0, 80));
            servo.to(angleMapped);
            print('set angle',angleMapped,angle);
        }


        msg = `
        speed         : ${speed},${speedMapped},
        angle         : ${angle},${angleMapped},
        distance      : ${distance},${distanceMapped},
        mappedAngle   : ${mappedAngle}`;

      //  print(msg);
        return msg;
    }



    app.get('/', function (request, responce) {
        var clientTime = new Date();
        print('Client Connected!: ', clientTime.getTime()%150260);
       responce.send("Robot is ready : example usage go to http://localhost/nav/75/-0.5");
    });
/*


    app.get('/nav/:speed/:turn', function (request, responce) {
        var speed    = parseInt(request.params.speed);
        var turn     = parseFloat(request.params.turn);
        var mapSpeed = Math.floor(speed.map(0,100,0,255));
        var mapTurn  = Math.floor(turn.map(-1,1,0,255));

        var result = `Recieved Data: ${speed}, ${turn}, mapped Values : ${mapSpeed}, ${mapTurn}`;

        responce.send(result);
    });


    app.get('/led/:interval', function (request, responce) {
        var interval  = parseInt(request.params.interval);

        var result = `Led blink Interval:${interval}`;

        print(result);
        print("Blink Interval : ",interval);
        led.blink(interval,function () {
        });

        responce.send(result);
    });

    app.get('/ledstop', function (request, responce) {
        var msg = "Blink Interval : Stop";

        led.off();
        led.stop();
        print(msg);
        responce.send(msg);
    });

    app.get('/motor/:mspeed/:delay', function (request, responce) {
        var motorSpeed  = parseFloat(request.params.mspeed);
        var mappedSpeed = motorSpeed.map(-1,1,0,180);

        var delay = parseInt(request.params.delay);

        var msg = "Motor Speed : " + motorSpeed + ", Mapped : " + mappedSpeed + ", Delay : " + delay;

        motor.to(mappedSpeed);

        board.wait(delay, function(){
            motor.stop();
            motor.center();
            print("Motor Speed : Stop");
        });


        print(msg);
        responce.send(msg);
    });

    app.get('/motortest/:testspeed/:testdelay', function (request, responce) {
        var speed =  parseFloat(request.params.testspeed);
        var delay = parseInt(request.params.testdelay);
        responce.send(motorSpeed(speed,delay));
    });


    app.get('/servo/:angle/delay/:delay', function (request, responce) {
        var angle =  parseFloat(request.params.angle);
        var delay =  parseInt(request.params.delay);
        //if(angle > -2 && angle < 2){

        var mappedAngle = Math.ceil( angle.map(0, 180,0,80) );

        var msg = "Server Posistion: " + angle + ", Delay : " + delay + ", mappedAngle : " + mappedAngle;

        servo.to(mappedAngle,delay);

        print(msg);
        responce.send(msg);
        // }else{
        //     var error = "ERROR: out of range -1 to 1";
        //     print(error);
        //     responce.send(error);
        // }
    });
*/

    // example url to run robot http://localhost/speed/0.5/angle/180/distance/500
    app.get('/speed/:speed/angle/:angle/distance/:distance', function (request, responce) {
        let arg = [
            request.params.speed,//0
            request.params.angle,//1
            request.params.distance//2
        ];
        print('set angle',arg[1]);

        responce.send(move(arg[0], arg[1], arg[2]));
    });


    app.listen(port);
    print(`server is running ${addr}:${port}`);
});

var server = express();
server.use(express.static(__dirname + '/public'));

server.listen(clientport);