#include <SPI.h>
#include <RH_RF95.h>
 
#define RFM95_CS 10
#define RFM95_RST 9
#define RFM95_INT 2
 
#define RF95_FREQ 915.0

#define LED 6
#define ledDelay 50


#define msg "Hello World #      "
#define SIZE 40


RH_RF95 rf95(RFM95_CS, RFM95_INT);
 
void setup() 
{
  pinMode(LED, OUTPUT);
  pinMode(RFM95_RST, OUTPUT);
  digitalWrite(RFM95_RST, HIGH);
 
  while (!Serial);
  Serial.begin(9600);
  delay(100);
 


  Serial.println("Packet Server : Send (Arduino LoRa RF95)");
 

  digitalWrite(RFM95_RST, LOW);
  delay(10);
  digitalWrite(RFM95_RST, HIGH);
  delay(10);
 
  while (!rf95.init()) {
    Serial.println("Packet Server : LoRa radio init failed");
    while (1);
  }
  Serial.println("Packet Server : RUnning OK!");
 
  if (!rf95.setFrequency(RF95_FREQ)) {
    Serial.println("Packet Server : wrong set Frequency => failed");
    while (1);
  }

  rf95.setTxPower(23, true);
}
 
int16_t packetnum = 0;  // packet counter, we increment per xmission
 
void loop(){
  
  
  char radiopacket[SIZE] = msg;


  itoa(packetnum++, radiopacket+13, 10);

  radiopacket[SIZE-1] = 0;  
  
  
  Serial.println("Sending..."); delay(10);
  
  rf95.send((uint8_t *)radiopacket, SIZE);
  rf95.waitPacketSent();
  Serial.println("Waiting for packet to complete..."); delay(10);
  // wait for client reply

  uint8_t buf[RH_RF95_MAX_MESSAGE_LEN];
  uint8_t len = sizeof(buf);
 

  delay(10);

  if (rf95.waitAvailableTimeout(1000)){ 
    //client reponce message 
    if (rf95.recv(buf, &len)){
     
     digitalWrite(LED, HIGH);

     delay(ledDelay);

      Serial.println((char*)buf);
      Serial.print("Packet Server : RSSI: ");
      Serial.println(rf95.lastRssi(), DEC);   

      digitalWrite(LED, LOW);
    } else {
      Serial.println("Packet Server : Receive failed");
    }
  }else{
    Serial.println("Packet Server : No reply, is the Client running?");
  }
  delay(1000);
}
