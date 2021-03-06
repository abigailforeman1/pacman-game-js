function init() {

  // CHALLENGES
  // placing multiple CSS classes onto the same grid square - simple fix of changing the order in CSS file
  // pacman movement storing directions from handlekeydown events and using them when possible - able to store a proposed direction in a variable and use it when pacman hits a wall but trying to find a way to check the proposed direction at every square and if it's not possible continue with current direction - a solution for this was to only update the direction variable IF pacman could move in that direction 
  // ghost movement !!!!! couldn't figure out for ages how to get them to move forward unless they hit a wall - am pleased with my ghost movement function though. Had a problem with ghosts repeating their movement back and forward and travelling through the walls - managed to figure out a solution using a filter on possible directions and then randomly choosing a direction from possible directions and only doing this when they hit a wall

  // ? make the grid 
  // ? make pacman 
  // ? build the maze walls with divs 
  // ? make pacman move!
  // ? add little food to every empty square 
  // ? pacman to eat food
  // ? pacman to get a point every time he eats food
  // ? pacman to enter and exit portal 
  // ? place big food on the screen 
  // ? add extra score when pacman eats big food
  // ? make pacman move continuously
  // ? add ghosts to the grid
  // ? make the ghosts move randomly
  // ? if the ghosts and pacman collide GAME OVER!
  // ? make ghosts travel through portal
  // ? if big food is eaten make ghosts slow down
  // ? if all food is eaten WINNER!
  // ? change colour of ghosts when pacman eats big food 
  // ? pacman eat blue ghost and send them back to the start and gets points
  // ? make sure ghosts timers are working ok
  // ? change pacman direction
  // ? add play again button and modal pop out 
  // ? add sounds 

  // ---------------------------------------------- VARIABLES ---------------------------------------------- //

  // DOM Elements 
  const grid = document.querySelector('.grid')
  const scoreDisplay = document.querySelector('.score-text')
  const highScoreDisplay = document.querySelector('.highscore-text')
  const startButton = document.querySelector('.start-button')
  const modal = document.querySelector('.modal')
  const restartButton = document.querySelector('.restart-button')
  const audio = document.querySelector('.sound-effects')
  const audioButton = document.querySelector('.audio-button')
  const themeTune = document.querySelector('.theme-tune')
  const sfxButton = document.querySelector('.sound-effects-button')
  const sfxAudio = document.querySelector('.sound-effects')

  // Grid variables 
  const width = 18
  const squareCount = width * width

  // Game variables  
  // grid
  const squares = []
  const mazeWalls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 26, 27, 35, 36, 38, 39, 40, 41, 42, 44, 45, 47, 48, 49, 50, 51, 53, 54, 56, 57, 58, 59, 60, 62, 63, 65, 66, 67, 68, 69, 71, 72, 89, 90, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 107, 108, 114, 119, 125, 126, 127, 128, 130, 139, 141, 142, 143, 148, 157, 162, 163, 164, 165, 166, 168, 173, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 186, 187, 188, 189, 190, 191, 193, 194, 195, 196, 197, 198, 206, 207, 215, 216, 218, 219, 220, 222, 224, 225, 227, 229, 230, 231, 233, 234, 236, 237, 238, 240, 245, 247, 248, 249, 251, 252, 258, 259, 260, 261, 262, 263, 269, 270, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 287, 288, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323]
  const bigFoods = [109, 124, 289, 304]

  // scoring
  let storedHiScore = localStorage.getItem('storedHiScore') ? JSON.parse(localStorage.getItem('storedHiScore')) : 0
  const data = JSON.parse(localStorage.getItem('storedHiScore'))

  // pacman info
  const pacmanStartIndex = 292
  let pacmanIndex = 292
  let direction = 'right'
  let playerScore = 0
  let startGameTimer

  // ghost info 
  let redGhostMovementTimer
  let blueGhostMovementTimer
  let orangeGhostMovementTimer
  let greenGhostMovementTimer
  const ghostDirectionOptions = [-width, width, -1, 1]
  const redGhost = {
    startIndex: 134,
    currentIndex: 134,
    speed: 400,
    scatterSpeed: 1000,
    ogDirection: -1,
    direction: -1,
    class: 'red-ghost',
    scatterColor: false
  }
  const blueGhost = {
    startIndex: 135,
    currentIndex: 135,
    speed: 600,
    scatterSpeed: 1000,
    ogDirection: 1,
    direction: 1,
    class: 'blue-ghost',
    scatterColor: false
  }
  const greenGhost = {
    startIndex: 152,
    currentIndex: 152,
    speed: 500,
    scatterSpeed: 1000,
    ogDirection: -1,
    direction: -1,
    class: 'green-ghost',
    scatterColor: false
  }
  const orangeGhost = {
    startIndex: 153,
    currentIndex: 153,
    speed: 350,
    scatterSpeed: 1000,
    ogDirection: 1,
    direction: 1,
    class: 'orange-ghost',
    scatterColor: false
  }
  let redGhostScatterTimer
  let blueGhostScatterTimer
  let orangeGhostScatterTimer
  let greenGhostScatterTimer

  // ---------------------------------------------- HIGHSCORE W/ LOCAL STORAGE ---------------------------------------------- //

  // called straight away 
  displayHiScore()

  function hiScoreCreate() {
    highScoreDisplay.innerHTML = storedHiScore
  }

  // called by gameOver
  function storeScores() {
    if (playerScore > storedHiScore) {
      storedHiScore = playerScore
      localStorage.setItem('storedHiScore', JSON.stringify(storedHiScore))
      hiScoreCreate()
    }
  }

  function displayHiScore() {
    data ? hiScoreCreate(data) : null
  }

  // * Function to toggle audio
  function toggleAudio() {
    audioButton.textContent === 'TURN MUSIC ON' ? audioButton.textContent = 'TURN MUSIC OFF' : audioButton.textContent = 'TURN MUSIC ON'
    return themeTune.paused ? themeTune.play() : themeTune.pause()
  }

  function toggleSoundEffects() {
    sfxButton.textContent === 'TURN SFX OFF' ? sfxButton.textContent = 'TURN SFX ON' : sfxButton.textContent = 'TURN SFX OFF'
    // return sfxAudio.paused ? sfxAudio.play() : sfxAudio.pause()
    return sfxAudio.muted === true ? sfxAudio.muted = false : sfxAudio.muted = true
  }

  // ---------------------------------------------- MAKING GRID ---------------------------------------------- //

  // * Function to create the grid
  function makeGrid() {
    for (let i = 0; i < squareCount; i++) {
      const square = document.createElement('div')
      square.classList.add('grid-item')
      // square.textContent = i
      grid.appendChild(square)
      squares.push(square)
    }
  }
  makeGrid()

  squares[pacmanIndex].classList.add('pacman') // controls where the player is based on the index of the square

  // * Function to add maze walls 
  function makeWalls() {
    mazeWalls.forEach((mazeWall) => {
      squares[mazeWall].classList.add('maze-wall')
    })
  }
  makeWalls()

  // * Function to add small food and big food around grid
  function addFood() {
    for (let i = 0; i < squareCount; i++) {
      if (!squares[i].classList.contains('maze-wall')) {
        squares[i].classList.add('food')
      }
    }
    squares[134].classList.remove('food')
    squares[135].classList.remove('food')
    squares[152].classList.remove('food')
    squares[153].classList.remove('food')

    bigFoods.forEach((bigFood) => {
      squares[bigFood].classList.add('big-food')
      squares[bigFood].classList.remove('food')
    })
  }
  addFood()

  // * Function to place ghosts in their start positions 
  function placeGhosts() {
    squares[redGhost.startIndex].classList.add('red-ghost')
    squares[blueGhost.startIndex].classList.add('blue-ghost')
    squares[orangeGhost.startIndex].classList.add('orange-ghost')
    squares[greenGhost.startIndex].classList.add('green-ghost')
  }
  placeGhosts()

  // ---------------------------------------------- STARTING THE GAME ---------------------------------------------- //

  // * Function to kick off the timers for pacman movement and ghost movement
  function startGame() {
    startGameTimer = setInterval(pacmanMovement, 300)
    redGhostMovementTimer = setInterval(() => {
      ghostMovement(redGhost)
    }, redGhost.speed)
    blueGhostMovementTimer = setInterval(() => {
      ghostMovement(blueGhost)
    }, blueGhost.speed)
    orangeGhostMovementTimer = setInterval(() => {
      ghostMovement(orangeGhost)
    }, orangeGhost.speed)
    greenGhostMovementTimer = setInterval(() => {
      ghostMovement(greenGhost)
    }, greenGhost.speed)
    startButton.classList.add('hidden')
  }

  function restartGhostNormalMovement() {
    redGhostMovementTimer = setInterval(() => {
      ghostMovement(redGhost)
    }, redGhost.speed)
    blueGhostMovementTimer = setInterval(() => {
      ghostMovement(blueGhost)
    }, blueGhost.speed)
    orangeGhostMovementTimer = setInterval(() => {
      ghostMovement(orangeGhost)
    }, orangeGhost.speed)
    greenGhostMovementTimer = setInterval(() => {
      ghostMovement(greenGhost)
    }, greenGhost.speed)
  }

  // ---------------------------------------------- PACMAN MOVEMENT ---------------------------------------------- //

  // * Function to store the players chosen direction for pacman
  function updateMovement(e) {
    switch (e.keyCode) {
      case 39:
        if (!squares[pacmanIndex + 1].classList.contains('maze-wall')) {
          direction = 'right'
        }
        break
      case 37:
        if (!squares[pacmanIndex - 1].classList.contains('maze-wall')) {
          direction = 'left'
        }
        break
      case 38:
        if (!squares[pacmanIndex - width].classList.contains('maze-wall')) {
          direction = 'up'
        }
        break
      case 40:
        if (!squares[pacmanIndex + width].classList.contains('maze-wall')) {
          direction = 'down'
        }
        break
      default:
        console.log('not valid!')
    }
  }

  // * Function to make pacman move
  function pacmanMovement() {

    // 39 = right 
    // 37 = left
    // 38 = up
    // 40 = down

    switch (direction) {
      case 'right':
        if (!squares[pacmanIndex + 1].classList.contains('maze-wall')) { // checking if next square to the right is not a maze wall  
          pacmanIndex++
        }
        break
      case 'left':
        if (!squares[pacmanIndex - 1].classList.contains('maze-wall')) {
          pacmanIndex--
        }
        break
      case 'up':
        if (!squares[pacmanIndex - width].classList.contains('maze-wall')) {
          pacmanIndex -= width
        }
        break
      case 'down':
        if (!squares[pacmanIndex + width].classList.contains('maze-wall')) {
          pacmanIndex += width
        }
        break
    }
    squares.forEach(square => square.classList.remove('pacman'))
    squares[pacmanIndex].classList.add('pacman')

    // squares.forEach(square => square.classList.remove('pacman-animation'))
    // squares[pacmanIndex].classList.add('pacman-animation')

    squares.forEach(square => square.classList.remove(direction))
    squares[pacmanIndex].classList.add(direction)

    eatFood()

    // * checking if pacman reaches the portal 
    if (pacmanIndex === 161 && direction === 'right') {
      pacmanIndex -= width
    } else if (pacmanIndex === 144 && direction === 'left') {
      pacmanIndex += width
    }

    if ((redGhost.scatterColor === false &&
      blueGhost.scatterColor === false &&
      orangeGhost.scatterColor === false &&
      greenGhost.scatterColor === false) &&
      ((squares[pacmanIndex].classList.contains('red-ghost')) ||
        (squares[pacmanIndex].classList.contains('blue-ghost')) ||
        (squares[pacmanIndex].classList.contains('orange-ghost')) ||
        (squares[pacmanIndex].classList.contains('green-ghost')))) {
      audio.src = 'assets/audio/game_over.wav'
      audio.play()
      gameOver()
    } else if ((redGhost.scatterColor === true &&
      blueGhost.scatterColor === true &&
      orangeGhost.scatterColor === true &&
      greenGhost.scatterColor === true) &&
      ((squares[pacmanIndex].classList.contains('red-ghost')) ||
        (squares[pacmanIndex].classList.contains('blue-ghost')) ||
        (squares[pacmanIndex].classList.contains('orange-ghost')) ||
        (squares[pacmanIndex].classList.contains('green-ghost')))) {
      audio.src = 'assets/audio/eat_ghost.wav'
      audio.play()
      playerScore += 200
      // * finding the ghost that pacman just ate
      if (redGhost.currentIndex === pacmanIndex) {
        squares[redGhost.currentIndex].classList.remove('red-ghost')
        squares[redGhost.currentIndex].classList.remove('scatter-ghost')
        clearInterval(redGhostScatterTimer)
        redGhost.currentIndex = redGhost.startIndex
        redGhost.direction = redGhost.ogDirection
        squares[redGhost.currentIndex].classList.add('red-ghost')
      } else if (blueGhost.currentIndex === pacmanIndex) {
        squares[blueGhost.currentIndex].classList.remove('blue-ghost')
        squares[blueGhost.currentIndex].classList.remove('scatter-ghost')
        clearInterval(blueGhostScatterTimer)
        blueGhost.currentIndex = blueGhost.startIndex
        blueGhost.direction = blueGhost.ogDirection
        squares[blueGhost.currentIndex].classList.add('blue-ghost')
      } else if (greenGhost.currentIndex === pacmanIndex) {
        squares[greenGhost.currentIndex].classList.remove('green-ghost')
        squares[greenGhost.currentIndex].classList.remove('scatter-ghost')
        clearInterval(greenGhostScatterTimer)
        greenGhost.currentIndex = greenGhost.startIndex
        greenGhost.direction = greenGhost.ogDirection
        squares[greenGhost.currentIndex].classList.add('green-ghost')
      } else if (orangeGhost.currentIndex === pacmanIndex) {
        squares[orangeGhost.currentIndex].classList.remove('orange-ghost')
        squares[orangeGhost.currentIndex].classList.remove('scatter-ghost')
        clearInterval(orangeGhostScatterTimer)
        orangeGhost.currentIndex = orangeGhost.startIndex
        orangeGhost.direction = orangeGhost.ogDirection
        squares[orangeGhost.currentIndex].classList.add('orange-ghost')
      }
    }
  }

  // ---------------------------------------------- GHOST MOVEMENT ---------------------------------------------- //

  // Ghost movement pseudocode RANDOM MOVEMENT

  // remove ghost class 
  // each interval of ghost movement use Math.random to randomly pick a direction from the 4 ghostDirectionOptions
  // check if this direction is possible (no other ghosts in the way or maze walls)
  // if it's possible, update the ghost current position variable and add the ghost class back on 
  // repeat

  // * Function to make the red ghost move
  function ghostMovement(ghostColor) {

    squares[ghostColor.currentIndex].classList.remove('scatter-ghost')
    squares[ghostColor.currentIndex].classList.remove(ghostColor.class)

    // * checks ghosts position for portal
    if (ghostColor.currentIndex === 161 && ghostColor.direction === 1) {
      ghostColor.currentIndex -= width
    } else if (ghostColor.currentIndex === 144 && ghostColor.direction === -1) {
      ghostColor.currentIndex += width
    }

    // * checks if the next square in the ghosts movement includes a wall, if it does - update the ghosts direction 
    if (squares[ghostColor.currentIndex + ghostColor.direction].classList.contains('maze-wall')) {
      updatedGhostDirection(ghostColor)
    } else {
      ghostColor.currentIndex += ghostColor.direction
    }
    squares[ghostColor.currentIndex].classList.add(ghostColor.class)

    // * checks if ghost scatter mode is on and adds scatter class 
    if (ghostColor.scatterColor === true) {
      squares[ghostColor.currentIndex].classList.add('scatter-ghost')
    }

    // * checking for pacman and ghost colision 
    if ((squares[ghostColor.currentIndex].classList.contains('pacman')) && ghostColor.scatterColor === false) {
      audio.src = 'assets/audio/game_over.wav'
      audio.play()
      gameOver()
    }
  }

  // * Function to find ghosts new movement
  function updatedGhostDirection(ghostColor) {
    // finding the index of all 4 possible squares surrounding the ghost and putting them into an array 
    const possibleSquareUp = ghostColor.currentIndex - width
    const possibleSquareDown = ghostColor.currentIndex + width
    const possibleSquareLeft = ghostColor.currentIndex - 1
    const possibleSquareRight = ghostColor.currentIndex + 1
    const possibleSquares = [possibleSquareUp, possibleSquareDown, possibleSquareLeft, possibleSquareRight]
    // filtering through these squares and removing any that contain a wall
    const availableGhostSquares = possibleSquares.filter(possibleSquare => {
      return !squares[possibleSquare].classList.contains('maze-wall')
    })
    // using Math.random to pick one of the available squares indexes
    const newIndex = availableGhostSquares[Math.floor(Math.random() * (availableGhostSquares.length))]
    // updating the ghosts current index with the new index
    ghostColor.currentIndex = newIndex
    // using the index of the chosen available square from the possibleSquares array and updating the ghosts direction
    ghostColor.direction = ghostDirectionOptions[possibleSquares.indexOf(newIndex)]
  }

  // * Function to slow down the ghosts when Pacman eats big food
  function ghostsSlow() {
    clearGhostTimers()

    redGhostScatterTimer = setInterval(() => {
      ghostMovement(redGhost)
    }, redGhost.scatterSpeed)
    blueGhostScatterTimer = setInterval(() => {
      ghostMovement(blueGhost)
    }, blueGhost.scatterSpeed)
    orangeGhostScatterTimer = setInterval(() => {
      ghostMovement(orangeGhost)
    }, orangeGhost.scatterSpeed)
    greenGhostScatterTimer = setInterval(() => {
      ghostMovement(greenGhost)
    }, greenGhost.scatterSpeed)

    setTimeout(clearScatterTimer, 5000)
  }

  function clearScatterTimer() {
    redGhost.scatterColor = false
    blueGhost.scatterColor = false
    orangeGhost.scatterColor = false
    greenGhost.scatterColor = false
    clearInterval(redGhostScatterTimer)
    clearInterval(blueGhostScatterTimer)
    clearInterval(orangeGhostScatterTimer)
    clearInterval(greenGhostScatterTimer)
    restartGhostNormalMovement()
  }

  // ---------------------------------------------- EATING FOOD ---------------------------------------------- //

  // * Function to check for pink food where pacman moves and update score
  function eatFood() {
    if (squares[pacmanIndex].classList.contains('food')) {
      audio.src = 'assets/audio/eat_dot.wav'
      audio.play()
      playerScore += 10
      scoreDisplay.innerHTML = playerScore
      squares[pacmanIndex].classList.remove('food')
    } else if (squares[pacmanIndex].classList.contains('big-food')) {
      audio.src = 'assets/audio/eat_big_food.wav'
      audio.play()
      playerScore += 50
      squares[redGhost.currentIndex].classList.add('scatter-ghost')
      squares[blueGhost.currentIndex].classList.add('scatter-ghost')
      squares[greenGhost.currentIndex].classList.add('scatter-ghost')
      squares[orangeGhost.currentIndex].classList.add('scatter-ghost')
      redGhost.scatterColor = true
      blueGhost.scatterColor = true
      orangeGhost.scatterColor = true
      greenGhost.scatterColor = true
      ghostsSlow()
      scoreDisplay.innerHTML = playerScore
      squares[pacmanIndex].classList.remove('big-food')
    }
    if (!squares.some(square => square.classList.contains('food'))) {
      console.log('WINNER!')
    }
  }

  // ---------------------------------------------- WIN CONDITION / GAME OVER ---------------------------------------------- //

  // * Function to clear normal ghost movement timers 
  function clearGhostTimers() {
    clearInterval(redGhostMovementTimer)
    clearInterval(blueGhostMovementTimer)
    clearInterval(orangeGhostMovementTimer)
    clearInterval(greenGhostMovementTimer)
  }

  // * Function to clear timers when player loses
  function gameOver() {
    clearInterval(startGameTimer)
    clearGhostTimers()
    clearInterval(redGhostScatterTimer)
    clearInterval(blueGhostScatterTimer)
    clearInterval(orangeGhostScatterTimer)
    clearInterval(greenGhostScatterTimer)
    storeScores()
    playerScore = 0
    startButton.classList.add('hidden')
    setTimeout(gameOverModal, 2000)
  }

  function gameOverModal() {
    modal.classList.add('show-modal')
    squares.forEach(square => square.classList.remove('red-ghost'))
    squares.forEach(square => square.classList.remove('blue-ghost'))
    squares.forEach(square => square.classList.remove('green-ghost'))
    squares.forEach(square => square.classList.remove('orange-ghost'))
    squares.forEach(square => square.classList.remove('food'))
    squares.forEach(square => square.classList.remove('big-food'))
    squares.forEach(square => square.classList.remove('pacman'))
    squares.forEach(square => square.classList.remove('scatter-ghost'))
    squares.forEach(square => square.classList.remove('up'))
    squares.forEach(square => square.classList.remove('down'))
    squares.forEach(square => square.classList.remove('left'))
  }

  function closeModal() {
    audio.src = null
    redGhost.currentIndex = redGhost.startIndex
    blueGhost.currentIndex = blueGhost.startIndex
    greenGhost.currentIndex = greenGhost.startIndex
    orangeGhost.currentIndex = orangeGhost.startIndex
    pacmanIndex = pacmanStartIndex
    direction = 'right'
    addFood()
    placeGhosts()
    modal.classList.remove('show-modal')
    setTimeout(startGame, 1000)
  }

  // * Event listeners
  window.addEventListener('keydown', updateMovement)
  startButton.addEventListener('click', startGame)
  restartButton.addEventListener('click', closeModal)
  audioButton.addEventListener('click', toggleAudio)
  sfxButton.addEventListener('click', toggleSoundEffects)
}

window.addEventListener('DOMContentLoaded', init)