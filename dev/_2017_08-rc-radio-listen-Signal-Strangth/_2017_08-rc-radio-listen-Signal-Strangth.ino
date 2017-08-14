// Arduino95_Listen
#include <SPI.h>
#include <RH_RF95.h>
 
#define RFM95_CS 10
#define RFM95_RST 9
#define RFM95_INT 2
 
#define RF95_FREQ 915.0
 
RH_RF95 rf95(RFM95_CS, RFM95_INT);
 
#define LED 6
 
void setup() 
{
  pinMode(LED, OUTPUT);     
  pinMode(RFM95_RST, OUTPUT);
  digitalWrite(RFM95_RST, HIGH);
 
  while (!Serial);
  Serial.begin(9600);
  delay(100);
 
  Serial.println("Packet Client : Listen (Arduino LoRa)");
  
  // manual reset
  digitalWrite(RFM95_RST, LOW);
  delay(10);
  digitalWrite(RFM95_RST, HIGH);
  delay(10);
 
  while (!rf95.init()) {
    Serial.println("Packet Client : LoRa radio init failed");
    while (1);
  }
  Serial.println("Packet Client : Running OK!");

  if (!rf95.setFrequency(RF95_FREQ)) {
    Serial.println("Packet Client : Wrong frequency => failed");
    while (1);
  }

  rf95.setTxPower(23, true);
}
 
void loop()
{
  if (rf95.available())
  {
    // Should be a message for us now   
    uint8_t buf[RH_RF95_MAX_MESSAGE_LEN];
    uint8_t len = sizeof(buf);
    
    if (rf95.recv(buf, &len))
    {
      digitalWrite(LED, HIGH);
     
      Serial.println((char*)buf);
       Serial.print("Packet Client : RSSI: ");
      Serial.println(rf95.lastRssi(), DEC);
      
      // Send a reply
      uint8_t data[] = "And hello back to you";
      rf95.send(data, sizeof(data));
      rf95.waitPacketSent();
      
      digitalWrite(LED, LOW);
    }
    else
    {
      Serial.println("Packet Client : Receive failed");
    }
  }
}
