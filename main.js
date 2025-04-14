const TicTacToe = (() => {
  const board = Array(9).fill('');
  let playerOne = null;
  let playerTwo = null;
  let currentPlayer = '';
  let turnNumber = 0;
  let message = null;
  let gameOver = false;
  let playerOneScore = null;
  let playerTwoScore = null;



  const createPlayer = (name, symbol) => {
    let wins = 0;
    return { name, symbol, wins };
  };


  const changeValue = (input, squareNumber) => {
    if (board[squareNumber] === '') {
      board[squareNumber] = input;
    }
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
      square.classList.remove('win-effect');
    });

    player1 = null;
    player2 = null;
    currentPlayer = '';
    turnNumber = 0;
    gameOver = false;
    message.textContent = '';
  };

  const resetGameBoardOnly = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
  
    const squares = document.querySelectorAll('.game-square');
    squares.forEach(square => {
      square.textContent = '';
      square.classList.remove('win-effect');
    });
  
    turnNumber = 0;
    gameOver = false;
    message.textContent = `It's your turn, ${currentPlayer.name}`;
  };

  const checkWinner = () => {
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

  const isDraw = () => {
    turnNumber === 9 && !checkWinner();
  };

  const updateScore = (player) => {
    player.wins++;
  
    if (player === playerOne) {
      playerOneScore.textContent = `${playerOne.name}: ${playerOne.wins}`;
    } else if (player === playerTwo) {
      playerTwoScore.textContent = `${playerOne.name}: ${playerTwo.wins}`;
    }
  };

  const highlightSquares = (combo) => {
    const squares = document.querySelectorAll('.game-square');
    combo.forEach(index => {
      squares[index].classList.add('win-effect');
    });
  };

  const renderGameBoard = (function () {
    const gameTitle = document.createElement('h1');
    gameTitle.className = 'game-title';
    gameTitle.textContent = 'Tic Tac Toe';
    document.body.appendChild(gameTitle);

    const playersContainer = document.createElement('div');
    playersContainer.className = 'players-container';
    document.body.appendChild(playersContainer);

    const playerOneLabel = document.createElement('label');
    playerOneLabel.textContent = 'Player One Name: ';
    playerOneLabel.className = 'player-label';
    const playerOneInput = document.createElement('input');
    playerOneInput.type = 'text';
    playerOneInput.className = 'player-input';
    playerOneInput.name = 'playerOneName';
    playerOneLabel.appendChild(playerOneInput);
    playersContainer.appendChild(playerOneLabel);

    const playerTwoLabel = document.createElement('label');
    playerTwoLabel.textContent = "Player Two Name: ";
    playerTwoLabel.className = 'player-label';
    const playerTwoInput = document.createElement('input');
    playerTwoInput.type = 'text';
    playerTwoInput.className = 'player-input';
    playerTwoInput.name = 'playerTwoName';
    playerTwoLabel.appendChild(playerTwoInput);
    playersContainer.appendChild(playerTwoLabel);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';
    document.body.appendChild(buttonsContainer);

    const startButton = document.createElement('button');
    startButton.className = 'start-button';
    startButton.textContent = 'Start Game';
    startButton.addEventListener('click', () => {
      resetGameBoardOnly();
      const name1 = playerOneInput.value || 'Player One';
      const name2 = playerTwoInput.value || 'Player Two';
      playerOne = createPlayer(name1, 'X');
      playerTwo = createPlayer(name2, 'O');
      currentPlayer = playerOne;
      playerOneScore.textContent = `${playerOne.name}: ${playerOne.wins}`;
      playerTwoScore.textContent = `${playerTwo.name}: ${playerTwo.wins}`;
      message.textContent= `It's your turn, ${currentPlayer.name}`;
      turnNumber ++;
    })
    buttonsContainer.appendChild(startButton);

    const resetButton = document.createElement('button');
    resetButton.className = 'reset-button';
    resetButton.textContent = 'Reset Game';
    resetButton.addEventListener('click', () => {
      resetGame();
    });
    buttonsContainer.appendChild(resetButton);

    const gameBoardContainer = document.createElement('div');
    gameBoardContainer.className = ('game-board-container');
    document.body.appendChild(gameBoardContainer);

    for (let i = 0; i < 9; i++) {
      const gameSquare = document.createElement('div');
      gameSquare.className = 'game-square';
      gameSquare.setAttribute('data-index', i);
      gameSquare.addEventListener('click', (event) => {
        if (!gameOver && currentPlayer && !event.target.textContent) {
          changeValue(currentPlayer.symbol, event.target.dataset.index);
          event.target.textContent = currentPlayer.symbol;

          const winningCombo = checkWinner();
          if (winningCombo) {
            message.textContent = `${currentPlayer.name} wins!`;
            highlightSquares(winningCombo);
            updateScore(currentPlayer);
            currentPlayer = null;
            gameOver = true;
          } else if (isDraw()) {
            message.textContent = `It's a draw!`;
            currentPlayer = null;
            gameOver = true;
          } else {
            toggleTurn();
            turnNumber++;
          }
        }
      });
      gameBoardContainer.appendChild(gameSquare);
    }

    const messageContainer = document.createElement('div');
    message = document.createElement('h2');
    messageContainer.className = 'message-container';
    message.className = 'message';
    messageContainer.appendChild(message);
    document.body.appendChild(messageContainer);

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
    document.body.appendChild(scoreboard);

  })();


})();
