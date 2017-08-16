#define LED 13      
char ledState = 0;
void setup(){
  Serial.begin(9600);  
  pinMode(LED, OUTPUT); 
  Serial.println("Toggle LED Enter : 0 or 1");
  Serial.flush();       // Clear receive buffer.
}
void loop(){
  if (Serial.available() >0){
    
    ledState = Serial.read(); 
    Serial.flush();
    
    switch (ledState) {
      case '1': if (digitalRead(LED) == LOW){
          digitalWrite(LED,HIGH);
        }
          break;
      case '0': if (digitalRead(LED) == HIGH){
         digitalWrite(LED,LOW);
        }
          break;
      }
    }
}
