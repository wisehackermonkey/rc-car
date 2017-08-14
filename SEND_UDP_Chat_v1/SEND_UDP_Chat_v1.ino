//Oran Collins 4/19/17
//two way chat program using the adafruit Lora
//https://www.adafruit.com/product/3072
//example code from adafruit 
//https://learn.adafruit.com/adafruit-rfm69hcw-and-rfm96-rfm95-rfm98-lora-packet-padio-breakouts?view=all
//Send_udp_chat.pde

// Example sketch showing how to create a simple addressed, reliable messaging server
// with the RHReliableDatagram class, using the RH_RF95 driver to control a RF95 radio.
// It is designed to work with the other example rf95_reliable_datagram_client
// For use with arduino uno


#include <RHReliableDatagram.h>
#include <RH_RF95.h>
#include <SPI.h>

#define CLIENT_ADDRESS 1
#define SERVER_ADDRESS 2
//status and message indeicator led
int LEDpin  = 6;
int ledDelay = 50;


//adjust numChars to change the max size of message that you want to be sent 
//"hello world" is ten characters
const byte numChars = 100;

// an array to store the received data
char receivedChars[numChars];

//used in recvWithEndMarker() to tell if data being read has
// already been stored or not
boolean newData = false;

// Storage for intiger version of user input to be sent over radio
uint8_t data[numChars];
// Dont put this on the stack:
uint8_t buf[RH_RF95_MAX_MESSAGE_LEN];


// Singleton instance of the radio driver
RH_RF95 driver;
//RH_RF95 driver(5, 2); // Rocket Scream Mini Ultra Pro with the RFM95W

// Class to manage message delivery and receipt, using the driver declared above
RHReliableDatagram manager(driver, SERVER_ADDRESS);

// Need this on Arduino Zero with SerialUSB port (eg RocketScream Mini Ultra Pro)
//#define Serial SerialUSB

void setup() 
{
  // Rocket Scream Mini Ultra Pro with the RFM95W only:
  // Ensure serial flash is not interfering with radio communication on SPI bus
  // pinMode(4, OUTPUT);
  // digitalWrite(4, HIGH);

  //status indicator led
  pinMode(LEDpin, OUTPUT);

  //blink when reset
  digitalWrite(LEDpin, HIGH);
  delay(ledDelay);
  digitalWrite(LEDpin, LOW);
  delay(ledDelay);

      
  Serial.begin(9600);
  while (!Serial) ; // Wait for serial port to be available
  if (!manager.init())
    Serial.println("init failed");
  // Defaults after init are 434.0MHz, 13dBm, Bw = 125 kHz, Cr = 4/5, Sf = 128chips/symbol, CRC on

  // The default transmitter power is 13dBm, using PA_BOOST.
  // If you are using RFM95/96/97/98 modules which uses the PA_BOOST transmitter pin, then 
  // you can set transmitter powers from 5 to 23 dBm:
  driver.setTxPower(23, false);
  // If you are using Modtronix inAir4 or inAir9,or any other module which uses the
  // transmitter RFO pins and not the PA_BOOST pins
  // then you can configure the power transmitter power for -1 to 14 dBm and with useRFO true. 
  // Failure to do that will result in extremely low transmit powers.
//  driver.setTxPower(14, true);
}


void loop()
{
  if (manager.available())
  {
    // Wait for a message addressed to us from the client
    uint8_t len = sizeof(buf);
    uint8_t from;

    
  

    if (manager.recvfromAck(buf, &len, &from)){ 
      digitalWrite(LEDpin, HIGH);
      delay(ledDelay);
      digitalWrite(LEDpin, LOW);
      delay(ledDelay);
		/*Example output
		Server : Hey dude
		Client : i am a robot
		*/
		Serial.print("Server : ");

		Serial.println((char*)data);

		Serial.print("Client : ");

    Serial.println((char*)buf);
    
    for(int i =0; i< numChars-1; i++){
      receivedChars[i] = ' ';
    }

		recvWithEndMarker();
 
		// converts the user input into a unsigned intiger array
		//"data[i]" is the data to be sent to other radio client
		for(int i =0; i< numChars-1; i++){

			data[i] = (uint8_t)receivedChars[i];
		
		}

      // Send a reply back to the originator client
      if (!manager.sendtoWait(data, sizeof(data), from))
        Serial.println("sendtoWait failed");
    }
  }
}



void recvWithEndMarker() {
	static byte index = 0;
	char endMarker = '\n';
	char readChar;
 

	while (Serial.available() > 0 && newData == false) {
		
		readChar = Serial.read();

		if (readChar != endMarker) {

			receivedChars[index] = readChar;
			index++;

			if (index >= numChars) {
				index = numChars - 1;
			}

		}else {
			receivedChars[index] = '\0'; // terminate the string
			index = 0;
			newData = true;
		}
	}
  
}

