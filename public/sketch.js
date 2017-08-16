var socket;
var URL_SERVER = window.location.origin;

var slider, slider2, posistions = {
    servo1: null,
    servo2: null
};


function setup() {

	createCanvas(window.innerWidth, window.innerHeight);
	background(50);
    socket = io.connect(URL_SERVER);

    socket.on('connected', function(data) {
        alert(data);
    });



    socket.on('serverMsg', function(data) {
        console.log(' Received From Server: ' + data);
        fill(255);
        textSize(32);
        text(data, width/2, hieght/2 );
    });

	slider = createSlider(0, 180, 90);
	slider.position(20,height/3 );
    rotate(PI/4.0);
    slider.style('width',  (width - 60) + 'px');

	slider2 = createSlider(0, 180, 90);
	slider2.position(20, height/3 * 2 );
    slider2.style('width',  (width - 60) + 'px');
}
function draw() {
    if( posistions.servo1 !== slider.value()){
        posistions.servo1 = slider.value();
        socket.emit('slider', posistions);
        print( posistions);
    }
    if( posistions.servo2 !== slider2.value()){
        posistions.servo2 = slider2.value();
        socket.emit('slider', posistions);
        print( posistions);
    }
    // socket.emit('slider', );
}




