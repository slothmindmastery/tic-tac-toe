const TicTacToe = (() => {
  const board = Array(9).fill('');
  let playerOne = null;
  let playerTwo = null;
  let currentPlayer = '';
  let turnNumber = 0;
  let message = null;
  let resetButton = null;
  let playAgainButton = null;
  let gameOver = false;
  let playerOneScore = null;
  let playerTwoScore = null;
  let lastStartingPlayer = null;

  const createPlayer = (name, symbol) => {
    let wins = 0;
    return { name, symbol, wins };
  };


  const placeSymbol = (input, squareNumber) => {
    if (board[squareNumber] === '') {
      board[squareNumber] = input;
      turnNumber++;
      return true;
    }
    return false;
  };

  const toggleTurn = () => {
    currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    message.textContent = `It's your turn, ${currentPlayer.name}`;
  };

  const resetGame = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
  
    const squares = document.querySelectorAll('.game-square');
    squares.forEach(square => {
      square.textContent = '';
      square.classList.remove('win-effect', 'draw-effect');
    });
  
    turnNumber = 0;
    gameOver = false;
  };

  const checkWin = () => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6]  // diagonals
    ];
  
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return combo;
      }
    }
    return null;
  };

  const checkDraw = () => {
    return turnNumber === 9 && !checkWin();
  };

  const updateScore = (player) => {
    player.wins++;
  
    if (player === playerOne) {
      playerOneScore.textContent = `${playerOne.name}: ${playerOne.wins}`;
    } else if (player === playerTwo) {
      playerTwoScore.textContent = `${playerTwo.name}: ${playerTwo.wins}`;
    }
  };

  const highlightSquares = (combo) => {
    const squares = document.querySelectorAll('.game-square');
    combo.forEach(index => {
      squares[index].classList.add('win-effect');
    });
  };

  const endGame = (resultText) => {
    message.textContent = resultText;
    currentPlayer = null;
    gameOver = true;
    resetButton.style.display = 'none';
    playAgainButton.style.display = 'inline-block';
  };

  const launchConfetti = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;
  
    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
  
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const renderGameBoard = (function () {

    //title
    const gameTitle = document.createElement('h1');
    gameTitle.className = 'game-title';
    gameTitle.textContent = 'Tic Tac Toe';
    document.body.appendChild(gameTitle);

    const messageContainer = document.createElement('div');
    message = document.createElement('h2');
    messageContainer.className = 'message-container';
    message.className = 'message';
    messageContainer.appendChild(message);
    document.body.appendChild(messageContainer);

    //gameboard and overlay
    const gameBoardWrapper = document.createElement('div');
    gameBoardWrapper.className = ('game-board-wrapper');
    const gameBoardContainer = document.createElement('div');
    gameBoardContainer.className = ('game-board-container');

    const gameOverlay  = document.createElement('div');
    gameOverlay.className = 'game-overlay';

    const playersContainer = document.createElement('div');
    playersContainer.className = 'players-container';

    const playerOneInput = document.createElement('input');
    playerOneInput.type = 'text';
    playerOneInput.className = 'player-input';
    playerOneInput.name = 'playerOneName';
    playerOneInput.placeholder = 'Player One';
    playersContainer.appendChild(playerOneInput);

    const playerTwoInput = document.createElement('input');
    playerTwoInput.type = 'text';
    playerTwoInput.className = 'player-input';
    playerTwoInput.name = 'playerTwoName';
    playerTwoInput.placeholder = 'Player Two';
    playersContainer.appendChild(playerTwoInput);

    const startButton = document.createElement('button');
    startButton.className = 'start-button';
    startButton.textContent = 'Start Game';
    startButton.addEventListener('click', () => {
      const name1 = playerOneInput.value || 'Player One';
      const name2 = playerTwoInput.value || 'Player Two';
      playerOne = createPlayer(name1, 'X');
      playerTwo = createPlayer(name2, 'O');
      currentPlayer = playerOne;
      lastStartingPlayer = playerOne;
      resetGame();
      playerOneScore.textContent = `${playerOne.name}: ${playerOne.wins}`;
      playerTwoScore.textContent = `${playerTwo.name}: ${playerTwo.wins}`;
      message.textContent= `It's your turn, ${currentPlayer.name}`;
      gameOverlay.classList.add('fade-out');
      setTimeout(() => {
        gameOverlay.style.display = 'none';
      }, 400);
      bottomBar.style.display = 'flex';
    })

    gameOverlay.appendChild(playersContainer);
    gameOverlay.appendChild(startButton);
    gameBoardWrapper.appendChild(gameBoardContainer);
    gameBoardWrapper.appendChild(gameOverlay);
    document.body.appendChild(gameBoardWrapper);

    for (let i = 0; i < 9; i++) {
      const gameSquare = document.createElement('div');
      gameSquare.className = 'game-square';
      gameSquare.setAttribute('data-index', i);
      gameSquare.addEventListener('click', (event) => {
        if (!gameOver && currentPlayer && !event.target.textContent) {

          
          const placed = placeSymbol(currentPlayer.symbol, event.target.dataset.index);

          if (placed) {
            event.target.textContent = currentPlayer.symbol;
            const winningCombo = checkWin();
            if (winningCombo) {
              highlightSquares(winningCombo);
              updateScore(currentPlayer);
              endGame(`${currentPlayer.name} wins!`);
              launchConfetti();
            } else if (checkDraw()) {
              const squares = document.querySelectorAll('.game-square');
              squares.forEach(square => {
                square.classList.add('draw-effect');
              });
              endGame(`It's a draw!`);
            } else {
              toggleTurn();
            }
          }
        }
      });
      gameBoardContainer.appendChild(gameSquare);
    }

    const bottomBar = document.createElement('div');
    bottomBar.className = 'bottom-bar';
    bottomBar.style.display = 'none';
    document.body.appendChild(bottomBar);

    resetButton = document.createElement('button');
    resetButton.className = 'reset-button';
    resetButton.textContent = 'Reset Game';
    resetButton.addEventListener('click', () => {
      resetGame();
    });
    bottomBar.appendChild(resetButton);

    playAgainButton = document.createElement('button');
    playAgainButton.className = 'play-again-button';
    playAgainButton.textContent = 'Play Again';
    playAgainButton.style.display = 'none';

    playAgainButton.addEventListener('click', () => {
      if (lastStartingPlayer === playerOne) {
        currentPlayer = playerTwo;
      } else {
        currentPlayer = playerOne;
      }
      lastStartingPlayer = currentPlayer;

      resetGame();

      message.textContent = `It's your turn first this time, ${currentPlayer.name}!`;

      resetButton.style.display = 'inline-block';
      playAgainButton.style.display = 'none';
    });
    bottomBar.appendChild(playAgainButton);

    const scoreboard = document.createElement('div');
    scoreboard.className = 'scoreboard';

    playerOneScore = document.createElement('div');
    playerOneScore.className = 'score';
    playerOneScore.textContent = 'Player One: 0';

    playerTwoScore = document.createElement('div');
    playerTwoScore.className = 'score';
    playerTwoScore.textContent = 'Player Two: 0';

    scoreboard.appendChild(playerOneScore);
    scoreboard.appendChild(playerTwoScore);
    bottomBar.appendChild(scoreboard);

  })();


})();
