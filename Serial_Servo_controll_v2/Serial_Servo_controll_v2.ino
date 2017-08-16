/*
  String to Integer conversion

 Reads a serial input string until it sees a newline, then converts
 the string to a number if the characters are digits.

 The circuit:
 No external components needed.

 created 29 Nov 2010
 by Tom Igoe

 This example code is in the public domain.
 */
 #include <Servo.h>

Servo servo1;
Servo servo2;

int servoPin1 = 9; 
int servoPin2 = 10; 

String inString = "";    // string to hold input

void setup() {
  servo1.attach(servoPin1);
  servo2.attach(servoPin2);
  pinMode(servoPin1, OUTPUT); 
  pinMode(servoPin2, OUTPUT); 
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // send an intro:
  Serial.println("\n\nServo Posisitioner: ");
  Serial.println();
}

void loop() {
  // Read serial input:
  while (Serial.available() > 0) {
    int inChar = Serial.read();
 
    
    inString += (char)inChar;
    
    if (inChar == '\n') {
      //https://stackoverflow.com/questions/11068450/arduino-c-language-parsing-string-with-delimiter-input-through-serial-interfa#14306981
      int first = inString.indexOf(',');
      int second = inString.indexOf(',', first + 1);
      String servoPos1 = inString.substring(0, first);
      String servoPos2 = inString.substring(first + 1, inString.length());
      int pos1 = servoPos1.toInt();
      int pos2 = servoPos2.toInt();
      Serial.print("Pos1: ");
      Serial.print(servoPos1);
      Serial.print(", Pos2: ");
      Serial.println(servoPos2);
      if(pos1 <= 180 && pos1 >= 0){
        servo1.write(pos1);
      }else{
        Serial.print("pos1 Out of bounds :");
        Serial.println(pos1);
      }
      
      if(pos2 <= 180 && pos2 >= 0){
        servo2.write(pos2);
      }else{
        Serial.print("pos2 Out of bounds :");
        Serial.println(pos2);
      }
      // clear the string for new input:
      inString = "";
    }
  }
}

