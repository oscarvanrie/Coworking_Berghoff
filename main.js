document.addEventListener("DOMContentLoaded", function() {
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
});