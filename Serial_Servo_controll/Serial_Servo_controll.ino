#include <Servo.h>

void readSerial();

Servo servo;

char servoPos = -1;
int servoPin = 9; 
int LED = 13;
String inputString = "";
boolean stringComplete = false;


void setup(){
  
  Serial.begin(9600); 
  servo.attach(servoPin);
  pinMode(servoPin, OUTPUT); 
  pinMode(LED, OUTPUT);
 
  Serial.println("Set Servo Postion Enter : <0 - 180>");
  Serial.flush();       // Clear receive buffer.

    while (!Serial) {
    ; }
}
void loop(){
  if (Serial.available() >0){
    readSerial();
    if (stringComplete) {
      int pos =  inputString.toInt();
      
      Serial.print(pos);
      Serial.print(", ");
      Serial.print(inputString);
      Serial.print(", ");
      Serial.println(stringComplete);
      
      switch (pos) {
        case 1: if (digitalRead(LED) == LOW){
            digitalWrite(LED,HIGH);
          }
            break;
        case 0: if (digitalRead(LED) == HIGH){
           digitalWrite(LED,LOW);
          }
            break;
        }
      inputString = "";
      stringComplete = false;
      
    }
  }
//  if (Serial.available() >0){
//    
//    servoPos = Serial.read(); 
//    
//    Serial.flush();
//
//    if(servoPos != -1){
//      Serial.println("NOT null!");
//    }
//  
//  }
}

void readSerial(){ 
  while ((char)Serial.read() != '\n') {
   
    char inChar = (char)Serial.read();
    //if (isDigit(inChar)) {
      inputString += inChar;
   // }
    
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}

