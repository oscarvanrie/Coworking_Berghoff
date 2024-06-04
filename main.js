"use strict";

(function() {
  const gameContainer = document.getElementById('game-container');
  const player = document.getElementById('player');
  const gameOverDisplay = document.getElementById('game-over');
  const newHighScore = document.getElementById('new-highscore');
  const scoreDisplay = document.getElementById('score');
  let playerPosition = 0;
  let score = 0;
  let stopDropping = true;
  let activeObstacles = [];

  function initGame() {
    stopDropping = false;
    startDroppingObstacles();
    hideControls();
  }


  function hideControls() {
    const controlsPanel = document.querySelector('.panel');
    controlsPanel.style.display = 'none';
  }


  function showControls() {
    const controlsPanel = document.querySelector('.panel');
    controlsPanel.style.display = 'block';
  }

  class Obstacle {
      constructor(type, speed,score) {
          this.type = type;
          this.speed = speed;
          this.score = score;
          this.element = document.createElement('img');
          this.element.style.width = "6rem";
          this.element.style.height = "6rem";

          this.element.classList.add('obstacle');
          this.element.classList.add(type);
          this.obstacleBad = ["./images/obstacel_1.png", "./images/obstacel_2.png", "./images/obstacel_3.png"];
          this.obstacleGood = ["./images/berghoofproduct_1.png", "./images/berghoofproduct_2.png", "./images/berghoofproduct_3.png"];

          if (this.type === "good") {
              const random = Math.floor(Math.random() * this.obstacleGood.length);
              console.log(this.obstacleGood[random]);
              this.element.src = this.obstacleGood[random];
          } else {
              const random = Math.floor(Math.random() * this.obstacleBad.length);
              this.element.src = this.obstacleBad[random];
          }
          document.body.appendChild(this.element);
          activeObstacles.push(this);
          this.setObstacle();
      }

      setObstacle() {
          const xPos = Math.floor(Math.random() * 3 ) - 1;
          this.element.style.left = calcPlayerPosition(xPos) + 'px';
          this.element.style.top = '-100px';
          this.move();
      }


      checkCollision() {
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = this.element.getBoundingClientRect();
        const hitboxWidth = playerRect.width * 0.5;
        const hitboxHeight = playerRect.height * 0.5;
        const hitboxLeft = playerRect.left + (playerRect.width - hitboxWidth) / 2;
        const hitboxTop = playerRect.top + (playerRect.height - hitboxHeight) / 2;
        if (
            hitboxTop < obstacleRect.bottom &&
            hitboxTop + hitboxHeight > obstacleRect.top &&
            hitboxLeft < obstacleRect.right &&
            hitboxLeft + hitboxWidth > obstacleRect.left
        ) {
            if (this.type == "good") {
                console.log("Collision! good ");
                this.element.remove();
                score++;
                updateScore();
            } else {
                console.log("Collision! bad");
                stopDropping = true;
                removeAllObstacles();
                showGameOver();
            }
        }
    }
    

      move() {
        const obstacle = this;
        const initialSpeed = this.speed;
        this.interval = setInterval(function() {
            const currentTop = parseInt(obstacle.element.style.top);
            const distanceFromTop = currentTop + obstacle.element.offsetHeight;
    
            const adjustedSpeed = initialSpeed + (obstacle.score / 5);
    
            if (currentTop >= window.innerHeight || stopDropping) {
                obstacle.element.remove();
                clearInterval(obstacle.interval);
                if (obstacle.type === "good" && !stopDropping) {
                    setTimeout(() => {
                        const newObstacle = new Obstacle(obstacle.type, obstacle.speed, Math.floor(Math.random() * 3) - 1);
                    }, 500);
                }
            } else {
                obstacle.element.style.top = (currentTop + adjustedSpeed) + 'px';
                obstacle.checkCollision();
            }
        }, 1000 / 60); 
    }
  }


  function removeAllObstacles() {
      activeObstacles.forEach(obstacle => {
          obstacle.element.remove();
          clearInterval(obstacle.interval);
      });
      activeObstacles = [];
  }

  function showGameOver() {
    gameOverDisplay.style.display = 'block';
    showControls();
    updateHighScore();
}


function updateHighScore() {
    const highScoreElement = document.getElementById('highscore');
    const currentHighScore = parseInt(highScoreElement.textContent);
    if (score > currentHighScore) {
        highScoreElement.textContent = score;
        newHighScore.style.display = 'block';
        startConfetti();
    }
}



  function resetGame() {
      stopDropping = true;
      score = 0;
      updateScore();
      gameOverDisplay.style.display = 'none';
      removeAllObstacles();
      playerPosition = 0;
      player.style.left = calcPlayerPosition(playerPosition) + 'px';
      newHighScore.style.display = 'none';
  }

  function startDroppingObstacles() {
    new Obstacle("good", 1.2,score);
      new Obstacle("good", 1,score);

      new Obstacle("bad", 1.6,score);
      new Obstacle("bad", 1.8,score);

      const obstacleGenerationInterval = setInterval(() => {
          if (!stopDropping) {
              new Obstacle("good", 1.2,score);
              new Obstacle("bad", 1.6,score);
          } else {
              clearInterval(obstacleGenerationInterval);
          }
      }, 2000);
}

  function movePlayer(direction) {
      if (direction === 'left' && playerPosition !== -1) {
          playerPosition -= 1;
      } else if (direction === 'right' && playerPosition !== 1) {
          playerPosition += 1;
      }
      player.style.left = calcPlayerPosition(playerPosition) + 'px';
  }

  function updateScore() {
    scoreDisplay.innerHTML = score;
  }


  function calcPlayerPosition(playerPos) {
      if (playerPos === -1) {
          return gameContainer.offsetWidth / 3 - player.offsetWidth / 2;
      } else if (playerPos === 1) {
          return gameContainer.offsetWidth * 3 / 4 - player.offsetWidth / 2;
      } else {
          return gameContainer.offsetWidth / 2 - player.offsetWidth / 2;
      }
  }
  function startConfetti() {
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}


  // Event listener for player movements and game start
  document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (stopDropping) {
            resetGame();
            initGame();
        }
    }
    if (!stopDropping) {
        if (event.key === 'ArrowLeft') {
            movePlayer('left');
        } else if (event.key === 'ArrowRight') {
            movePlayer('right');
        }
    }
});
})();
