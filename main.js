"use strict";
(function() {
    screenWidth;
    screenHeight;
    class Obstacel {
        yPos = 0;
        // snelheid, of het een obstacel is (goed of slecht)
        constructor(snelheid, obstacel, xPos) {
            this.snelheid = snelheid;
            this.obstacel = obstacel;
            this.xPos = xPos;
        }

        beweeg() {

            function updateCounter() {
                if (yPos < screenHeight) {
                    this.yPos = this.yPos - 10;
                } else {
                    clearInterval(intervalId);
                }
            }
        
            // Start the interval timer
            const intervalId = setInterval(updateCounter, 1000); 

        }



    }
})