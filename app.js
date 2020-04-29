$(document).ready(() => {
  const gridSquareElems = $('.grid > div');
  const scoreElem = $('.score > span');
  const startElem = $('#start');

  // The width of the playing area
  const gridWidth = 10;
  // The initial speed of snake, measured in how many squares it moves in a second
  const startSpeed = 3
  // Number between 0 to 1 which indicates the increase in snake's speed after eating an apple
  const speedIncrease = 0.1;

  let currentSquareIndex = 0;
  let appleSquareIndex = 0;
  let currentSnakePath = [];
  let direction = 1;
  let score = 0;
  let intervalTime = 1000;
  let interval = null;

  // Randomly generate apple in grid but at a place snake isn't already present
  function generateApple() {
    do {
      appleSquareIndex = Math.floor(Math.random() * gridSquareElems.length);
    } while(gridSquareElems.eq(appleSquareIndex).hasClass('snake'))
    gridSquareElems.eq(appleSquareIndex).addClass('apple');
  }

  // Start or restart game
  function startGame() {
    currentSnakePath.forEach(index => gridSquareElems.eq(index).removeClass('snake'));
    gridSquareElems.eq(appleSquareIndex).removeClass('apple');
    clearInterval(interval);
    score = 0;
    direction = 1;
    scoreElem.text(score);
    intervalTime = 1000 / startSpeed;
    currentSnakePath = [2, 1, 0];
    currentSquareIndex = 0;
    currentSnakePath.forEach(index => gridSquareElems.eq(index).addClass('snake'));
    generateApple();
    interval = setInterval(moveHandler, intervalTime);
  }

  startElem.click(startGame);

  function moveHandler() {
    if (
      // snake hits left wall
      (currentSnakePath[0] % gridWidth === 0 && direction === -1) || 
      // snake hits top wall
      (currentSnakePath[0] - gridWidth < 0 && direction === -gridWidth) || 
      // snake hits right wall
      (currentSnakePath[0] % gridWidth === gridWidth - 1 && direction === 1) ||
      // snake hits bottom wall
      (currentSnakePath[0] + gridWidth >= Math.pow(gridWidth, 2) && direction === gridWidth) ||
      // snake hits itself
      gridSquareElems.eq(currentSnakePath[0] + direction).hasClass('snake')
    ) {
      alert('Game over!');
      return clearInterval(interval);
    }

    // find index of next square in path and move snake there
    const newPathIndex = currentSnakePath[0] + direction;
    currentSnakePath.unshift(newPathIndex);
    gridSquareElems.eq(newPathIndex).addClass('snake');
    const snakeTailIndex = currentSnakePath.pop();
    gridSquareElems.eq(snakeTailIndex).removeClass('snake');

    // if next square is apple, then increase length of snake and score. Regenerate apple and increase speed of snake
    if (gridSquareElems.eq(currentSnakePath[0]).hasClass('apple')) {
      gridSquareElems.eq(currentSnakePath[0]).removeClass('apple');
      currentSnakePath.push(snakeTailIndex);
      gridSquareElems.eq(snakeTailIndex).addClass('snake');
      generateApple();
      score++;
      scoreElem.text(score);
      clearInterval(interval);
      intervalTime *= 1 - speedIncrease;
      interval = setInterval(moveHandler, intervalTime);
    }
  }

  function handleKeyUp(event) {
    switch (event.keyCode) {
      // left key
      case 37:
        if (direction !== 1) direction = -1
      break;
      // up key
      case 38:
        if (direction !== gridWidth) direction = -gridWidth;
      break;
      // right key
      case 39:
        if (direction !== -1) direction = 1;
      break;
      // down key
      case 40:
        if (direction !== -gridWidth) direction = gridWidth; 
      break;
    }
  }

  $(document).keyup(handleKeyUp);
});