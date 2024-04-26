"use strict";
(function() {
  const gameContainer = document.getElementById('game-container');
    const player = document.getElementById('player');
    let playerPosition = 0; // 0 voor het midden, -1 voor links, 1 voor rechts

    // Functie om de speler te verplaatsen
    function movePlayer(direction) {
        if (direction === 'left' && playerPosition !== -1) {
            playerPosition -= 1;
        } else if (direction === 'right' && playerPosition !== 1) {
            playerPosition += 1;
        }
        player.style.left = calcPlayerPosition() + 'px';
    }

    // Functie om de positie van de speler te berekenen op basis van de rijstroken
    function calcPlayerPosition() {
        if (playerPosition === -1) {
            return gameContainer.offsetWidth / 4 - player.offsetWidth / 2; // Plaatst de speler op de linkse rijstrook
        } else if (playerPosition === 1) {
            return gameContainer.offsetWidth * 3 / 4 - player.offsetWidth / 2; // Plaatst de speler op de rechtse rijstrook
        } else {
            return gameContainer.offsetWidth / 2 - player.offsetWidth / 2; // Plaatst de speler in het midden
        }
    }

    // Event listener voor spelerbewegingen
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            movePlayer('left');
        } else if (event.key === 'ArrowRight') {
            movePlayer('right');
        }
    });
})();

document.addEventListener("DOMContentLoaded", function() {
  const gameContainer = document.getElementById('game-container');
  const player = document.getElementById('player');
  const scoreDisplay = document.getElementById('score');
  const highScore = document.getElementById('highscore');
  const gameOverDisplay = document.getElementById('game-over');
  let playerPosition = 0; // 0 voor het midden, -1 voor links, 1 voor rechts
  let score = 0;
  let gameRunning = true;
  let coinIntervalId;
  let obstacleIntervalId;


  // Functie om een munt of obstakel te maken
  function createObject(isCoin) {
    const object = document.createElement('div');
    object.classList.add(isCoin ? 'coin' : 'obstacle');
    object.style.top = '0px';
    const objectPosition = Math.random() * 3; // Willekeurige rijstrook: 0 voor links, 1 voor midden, 2 voor rechts
    if (objectPosition < 1) {
      object.style.left = gameContainer.offsetWidth / 4 - player.offsetWidth / 2 + 'px'; // Linkse rijstrook
    } else if (objectPosition < 2) {
      object.style.left = gameContainer.offsetWidth / 2 - player.offsetWidth / 2 + 'px'; // Midden
    } else {
      object.style.left = gameContainer.offsetWidth * 3 / 4 - player.offsetWidth / 2 + 'px'; // Rechtse rijstrook
    }
    gameContainer.appendChild(object);

    // Animeren van het object
    let currentTop = 0;
    const objectInterval = setInterval(() => {
      currentTop += 8; // Aanpassen van de snelheid waarmee het object valt
      object.style.top = currentTop + 'px';
      // Controleren of het object de speler raakt
      if (
        currentTop >= gameContainer.offsetHeight - player.offsetHeight &&
        Math.abs(parseInt(object.style.left) - parseInt(player.style.left)) < 20 // Controleren of het object en de speler dichtbij elkaar zijn
      ) {
        if (isCoin) {
          object.remove(); // Verwijder de munt als de speler deze raakt
          clearInterval(objectInterval); // Stop de animatie
          updateScore(); // Update de score
        } else {
          endGame(); // Einde van het spel als de speler een obstakel raakt
        }
      }
      // Controleren of het object het einde van het scherm heeft bereikt
      if (currentTop >= gameContainer.offsetHeight) {
        object.remove(); // Verwijder het object als het het einde van het scherm heeft bereikt
        clearInterval(objectInterval); // Stop de animatie
      }
    }, 30); // Aanpassen van de valtijd van het object

    // Retourneer het interval ID voor later gebruik
    return objectInterval;
  }

  // Functie om continu munten en obstakels te maken
  function createObjects() {
    coinIntervalId = setInterval(() => {
      createObject(true);
    }, 2000); // Aanpassen van de interval waarmee munten verschijnen

    obstacleIntervalId = setInterval(() => {
      createObject(false);
    }, 2500); // Aanpassen van de interval waarmee obstakels verschijnen
  }

  // Functie om de score bij te werken
  function updateScore() {
    score++;
    scoreDisplay.textContent = score;
    // Controleren of de score een veelvoud van 10 is
    if (score % 10 === 0) {
      changePlayerColor(); // Verander de kleur van de speler
    }
  }

  // Functie om de kleur van de speler te veranderen
  function changePlayerColor() {
    const colors = ['#ff0000', '#00ff00', '#0000ff']; // Array van kleuren
    const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Kies een willekeurige kleur
    player.style.backgroundColor = randomColor; // Pas de achtergrondkleur van de speler aan
  }

  // Functie om het spel te beëindigen
  function endGame() {
    gameRunning = false;
    clearInterval(coinIntervalId); // Stop het interval voor het maken van munten
    clearInterval(obstacleIntervalId); // Stop het interval voor het maken van obstakels
    gameOverDisplay.style.display = 'block'; // Toon het "Game Over"-bericht
    if (highScore.textContent < score) {
      highScore.textContent = score; // Update de highscore
    }
  }

  // Start het maken van munten en obstakels
  createObjects();
});
