var socket;
var URL_SERVER = window.location.origin;

var slider, slider2, slider3, posistions = {
    servo1: null,
    servo2: null,
    servo3: null
};


function setup() {

	createCanvas(window.innerWidth, window.innerHeight);
	// createCanvas(180, 180);
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
	slider.position(20,height/5);
    rotate(PI/4.0);
    slider.style('width',  (width - 60) + 'px');

    slider2 = createSlider(0, 180, 90);
    slider2.position(20, height/2);
    slider2.style('width',  (width - 60) + 'px');

    slider3 = createSlider(0, 180, 90);

    slider3.position(20, height/5 * 4 );
    slider3.style('width',  (width - 60) + 'px');
}
function draw() {
   //moveByMouse();
   writeServo();
   }
function writeServo() {
    if( posistions.servo1 !== slider.value()){
        posistions.servo1 = slider.value();
        socket.emit('slider', posistions);
        print( posistions);
    }
    if( posistions.servo2 !== slider2.value()){
        posistions.servo2 = slider2.value();
        socket.emit('slider', posistions);
        print( posistions);
    } if( posistions.servo3 !== slider3.value()){
        posistions.servo3= slider3.value();
        socket.emit('slider', posistions);
        print( posistions);
    }
}

function moveByMouse(){
   if( posistions.servo1 !== mouseX){
       if(mouseX <= 180 && mouseX >= 0) {
           posistions.servo1 = mouseX;

           socket.emit('slider', posistions);
       }
        print( posistions);
    }
    
    if( posistions.servo2 !== mouseY){
        if(mouseY <= 180 && mouseY >= 0) {
            posistions.servo2 = mouseY;
            socket.emit('slider', posistions);
        }
        print( posistions);
    }
}


