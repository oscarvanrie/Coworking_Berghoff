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
  let droppingSpeed = 1250;
  const savedHighScore = localStorage.getItem('highscore');
  let highScore = 0;
  let levensOver = 3;
  let volHart = Array.from(document.querySelectorAll(".volHart"));
  let leegHart = Array.from(document.querySelectorAll(".leegHart"));
  
  console.log(volHart);
  console.log(leegHart);

  
  function updateHarten() {
    if (levensOver === 0) {
        stopDropping = true;
        removeAllObstacles();
        showGameOver();
    }
    // Verberg alle harten
    leegHart.forEach((lhart) => {
        lhart.style.display = "none";
    });
    volHart.forEach((vhart) => {
        vhart.style.display = "none";
    });



    for (let i = 0; i < 3; i++) {
        console.log(i)
        if (i + 1 > levensOver) {
            leegHart[i].style.display = "block";
            volHart[i].style.display = "none";
        } else {
            leegHart[i].style.display = "none";
            volHart[i].style.display = "block";
        }
    }
}

  updateHarten();


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
          this.dead = false;

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
          this.element.style.left = calcPlayerPosition(xPos) + 50 + 'px';
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
                this.dead = true;
                //droppingSpeed = droppingSpeed - 10;
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
        this.interval = setInterval(() => { 
            if (this.dead === false) { 
                const currentTop = parseInt(obstacle.element.style.top);
    
                const adjustedSpeed = initialSpeed + (obstacle.score / 5);
    
                if (currentTop >= window.innerHeight || stopDropping) {
                    obstacle.element.remove();
                    clearInterval(obstacle.interval);
                    if (obstacle.type === "good" && !stopDropping) {
                        levensOver = levensOver - 1;
                        updateHarten();
                        obstacle.remove();
                    }
                } else {
                    obstacle.element.style.top = (currentTop + adjustedSpeed) + 'px';
                    obstacle.checkCollision();
                }
    
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
        localStorage.setItem('highscore', score);  // high score opslaan in browser.
        startConfetti();
    }
}
function loadHighScore() {
    const savedHighScore = localStorage.getItem('highscore');
    if (savedHighScore !== null) {
        highScore = parseInt(savedHighScore);
        const highScoreElement = document.getElementById('highscore');
        highScoreElement.textContent = highScore;
    }
}



    function resetGame() {
        stopDropping = true;
        score = 0;
        droppingSpeed = 1250; 
        levensOver = 3;
        updateHarten();
        updateScore();
        gameOverDisplay.style.display = 'none';
        removeAllObstacles();
        playerPosition = 0;
        player.style.left = calcPlayerPosition(playerPosition) + 'px';
        newHighScore.style.display = 'none';
    }

    
    function getRandomObstacleType() {
        return Math.random() < 0.5 ? "good" : "bad";
      }
    function startDroppingObstacles() {
    new Obstacle(getRandomObstacleType(), Math.floor(Math.random() * 5) + 3, score);

    const obstacleGenerationInterval = setInterval(() => {
      if (!stopDropping) {
          
          new Obstacle(getRandomObstacleType(), Math.floor(Math.random() * 5) + 3, score);
      } else {
          clearInterval(obstacleGenerationInterval);
      }
  }, droppingSpeed);

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


  document.addEventListener('keydown', function(event) {
    loadHighScore();
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
