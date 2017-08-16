/*Serial_LED_02.ino  Arduining 4 May 2015
Controlling the LED in pin 13 with the Serial Monitor.
--- Command list: ---
? -> Print this HELP 
a -> LED On  "activate"
d -> LED Off "deactivate"
s -> LED     "status" 

Example using the switch statement.
*/
 
#define LED 13          // Pin 13 is connected to the LED
char rxChar= 0;         // RXcHAR holds the received command.

//=== function to print the command list:  ===========================
void printHelp(void){
  Serial.println("--- Command list: ---");
  Serial.println("? -> Print this HELP");  
  Serial.println("a -> LED On  \"activate\"");
  Serial.println("d -> LED Off \"deactivate\"");
  Serial.println("s -> LED     \"status\"");  
  }
  
//---------------- setup ---------------------------------------------
void setup(){
  Serial.begin(9600);   // Open serial port (9600 bauds).
  pinMode(LED, OUTPUT); // Sets pin 13 as OUTPUT.
  Serial.flush();       // Clear receive buffer.
//  printHelp();          // Print the command list.
}

//--------------- loop ----------------------------------------------- 
void loop(){
  if (Serial.available() >0){          // Check receive buffer.
    rxChar = Serial.read();             // Save character received. 
    Serial.flush();                    // Clear receive buffer.
  
  switch (rxChar) {
    case '1':
    case 'a':
    case 'A':                          // If received 'a' or 'A':
  if (digitalRead(LED) == LOW){        // If LED is Off:
          digitalWrite(LED,HIGH);      // Turn On the LED.
//          Serial.println("LED turned On");
  }
       // else Serial.println("LED already On!");
        break;
    case '0':
    case 'd':
    case 'D':                          // If received 'd' or 'D':
  if (digitalRead(LED) == HIGH){       // If LED is On:
          digitalWrite(LED,LOW);       // Turn Off the LED.
         // Serial.println("LED turned Off");
  }
        //else Serial.println("LED already Off!");
        break;
        
    case 's':
    case 'S':                          // If received  's' or 'S':
  if (digitalRead(LED) == HIGH)        // Read LED status.
          Serial.println("LED status: On");
       // else Serial.println("LED status: Off");
        break;
      
//    default:                           
//      Serial.print("'");
//      Serial.print((char)rxChar);
//      Serial.println("' is not a command!");
    }
  }
}
