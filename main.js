const TicTacToe = (() => {
  const board = Array(9).fill('');
  let player1 = null;
  let player2 = null;
  let currentPlayer = '';
  let turnNumber = 0;
  let message = null;
  let gameOver = false;


  const changeValue = (input, squareNumber) => {
    if (board[squareNumber] === '') {
      board[squareNumber] = input;
    }
  };

  const renderGameBoard = (function () {
    const gameTitle = document.createElement('h1');
    gameTitle.className = 'game-title';
    gameTitle.textContent = 'Tic Tac Toe';
    document.body.appendChild(gameTitle);

    const players = document.createElement('div');
    players.className = 'players';
    document.body.appendChild(players);

    const player1Label = document.createElement('label');
    player1Label.textContent = 'Player 1 Name: ';
    player1Label.className = 'player-label';
    const player1Input = document.createElement('input');
    player1Input.type = 'text';
    player1Input.className = 'player-name';
    player1Input.name = 'player1Name';
    player1Label.appendChild(player1Input);
    players.appendChild(player1Label);

    const player2Label = document.createElement('label');
    player2Label.textContent = "Player 2 Name: ";
    player2Label.className = 'player-label';
    const player2Input = document.createElement('input');
    player2Input.type = 'text';
    player2Input.id = 'player-name';
    player2Input.name = 'player2Name';
    player2Label.appendChild(player2Input);
    players.appendChild(player2Label);

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    document.body.appendChild(buttons);

    const startButton = document.createElement('button');
    startButton.className = 'start-button';
    startButton.textContent = 'Start Game';
    startButton.addEventListener('click', () => {
      const name1 = player1Input.value || 'Player 1';
      const name2 = player2Input.value || 'Player 2';
      player1 = createPlayer(name1, 'X');
      player2 = createPlayer(name2, 'O');
      currentPlayer = player1;
      message.textContent= `It's your turn, ${currentPlayer.name}`;
      turnNumber ++;
    })
    buttons.appendChild(startButton);

    const resetButton = document.createElement('button');
    resetButton.className = 'reset-button';
    resetButton.textContent = 'Reset Game';
    resetButton.addEventListener('click', () => {
      resetGame();
    });
    buttons.appendChild(resetButton);

    const gameCanvas = document.createElement('div');
    gameCanvas.className = ('game-canvas');
    document.body.appendChild(gameCanvas);

    for (let i = 0; i < 9; i++) {
      const gameSquare = document.createElement('div');
      gameSquare.className = 'game-square';
      gameSquare.setAttribute('data-index', i);
      gameSquare.addEventListener('click', (event) => {
        if (!gameOver && currentPlayer && !event.target.textContent) {
          changeValue(currentPlayer.symbol, event.target.dataset.index);
          event.target.textContent = currentPlayer.symbol;

          if (checkWinner()) {
            message.textContent = `${currentPlayer.name} wins!`;
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
      gameCanvas.appendChild(gameSquare);
    }

    const messages = document.createElement('div');
    message = document.createElement('h2');
    messages.className = 'messages';
    message.className = 'message';
    messages.appendChild(message);
    document.body.appendChild(messages);

  })();

  const createPlayer = (name, symbol) => {
    let winStatus = '';
    return { name, symbol, winStatus };
  };

  const toggleTurn = () => {
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
    message.textContent = `It's your turn, ${currentPlayer.name}`;
  };

  const resetGame = () => {
    const clearBoard = (function () {
      for (let i = 0; i < board.length; i++) {
        board[i] = '';
      }
    })();
    
    const clearBoardUI = (function () {
      const squares = document.querySelectorAll('.game-square');
      squares.forEach(square => {
        square.textContent = '';
      });
    })();

    player1 = null;
    player2 = null;
    currentPlayer = '';
    turnNumber = 0;
    gameOver = false;
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
        return true;
      }
    }
  
    return false;
  };

  const isDraw = () => turnNumber === 9 && !checkWinner();

})();
