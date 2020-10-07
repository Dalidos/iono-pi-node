#Iono Pi Node Typescript module
 * Version: 1.0

##Requirement:
- Raspberry Pi
- Iono Pi board
- Node.js with Typescript
- iono-pi-kernel-module from sfera-labs (https://github.com/sfera-labs/iono-pi-kernel-module)

##Installation
Git clone this project in your project\
https://github.com/Dalidos/iono-pi-node

Developed in Typescript, compilation in Javascript is provided in the "js" folder.

##Usage

```typescript
    import {Ionopi} from "<your project path>/ionopi/ionopi";

    const ionopi = new Ionopi();

    /**
     * ===============================================
     * ANALOG INPUT
     * ===============================================
     */

    /**
     * Reads the analog input
     */
    const ai1 = await ionopi.ai(1);
    console.log(ai1); // value in mV

    /**
     * ===============================================
     * DIGITAL INPUT
     * ===============================================
     */

    /**
     * Reads the digital input
     */
    const di1 = await ionopi.di(1);
    console.log(di1); // true or false

    /**
     * ===============================================
     * OPEN COLLECTOR OUTPUT (digital output)
     * ===============================================
     */

    /**
     * Reads the open collector output
     */
    const oc1 = await ionopi.oc(1);
    console.log(oc1); // true or false

    /**
     * Sets the open collector output to on and off
     */
    let oc1Set = await ionopi.oc(1, 1);
    console.log(oc1Set); // true

    setTimeout(async () => {
        oc1Set = await ionopi.oc(1, 0);
        console.log(oc1Set); // false
    }, 3000);

    /**
     * ===============================================
     * RELAY
     * ===============================================
     */

    /**
     * Reads the relay
     */
    const relay1 = await ionopi.relay(1);
    console.log(relay1); // true or false

    /**
     * Sets the relay to on and off
     */
    let relay1Set = await ionopi.relay(1, 1);
    console.log(relay1Set); // true

    setTimeout(async () => {
        relay1Set = await ionopi.relay(1, "F"); // F: toggle the state
        console.log(relay1Set); // false
    }, 1000);

    /**
     * ===============================================
     * LED
     * ===============================================
     */

    /**
     * Reads the LED
     */
    const led = await ionopi.led();
    console.log(led); // true or false

    /**
     * Sets the LED to on and off
     */
    let ledSet = await ionopi.led("F"); // F: toggle the state
    console.log(ledSet); // true
    setTimeout(async () => {
        ledSet = await ionopi.led(0);
        console.log(ledSet); // false
    }, 2000);

    /**
     * Blinks the LED 1 secondes, 1 time
     */
    ledSet = await ionopi.led({tOn: 1000});
    console.log(ledSet); // return false at the end

    /**
     * Blinks the LED 100 ms to on, 200 ms to off, 10 times
     */
    ledSet = await ionopi.led({tOn: 100, tOff: 200, rep: 10});
    console.log(ledSet); // return false at the end

    /**
     * ===============================================
     * WIEGAND and 1-WIRE are not developed yet.
     * ===============================================
     */
```
###Wiegand and 1-Wire
WIEGAND and 1-WIRE are not developed yet because the original project did not need this. If you want, you can help develop these features.

##Licence:
MIT

## Author:
**SCHWARTZ Anthony** (GitHub: Dalidos)\
_Software Developer_\
\
developped for\
**Apaco AG**\
Baselstrasse 71\
4203 Grellingen - Schweiz\
www.apaco.ch
