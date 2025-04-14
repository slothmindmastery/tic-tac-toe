const TicTacToe = (() => {

  // Game State
  const board = Array(9).fill('');
  let playerOne = null;
  let playerTwo = null;
  let currentPlayer = '';
  let lastStartingPlayer = null;
  let turnNumber = 0;
  let gameOver = false;

  // DOM Elements
  const elementDefinitions = { 
    h1: ['title'],
    h2: ['message'],
    button: ['resetButton', 'startButton', 'playAgainButton'],
    div: ['messageContainer', 'gameBoardWrapper', 'gameBoardContainer', 'gameOverlay', 'playersContainer', 'bottomBar', 'scoreboard', 'playerOneScore', 'playerTwoScore'],
    input: ['playerOneInput', 'playerTwoInput']
  }

  const elements = {
    squares: [],
  };

  // Helpers
  const camelToKebab = (str) => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  };

  const setTextContent = (updates) => {
    Object.entries(updates).forEach(([key, value]) => {
      if (elements[key]) {
        elements[key].textContent = value;
      }
    });
  };

  const configureInput = (input, name, placeholder) => {
    input.type = 'text';
    input.name = name;
    input.placeholder = placeholder;
  };

  const hideElements = (...keys) => {
    keys.forEach((key) => {
      if (elements[key]) {
        elements[key].style.display = 'none';
      }
    });
  };
  
  const showElements = (...keys) => {
    let layout = 'inline-block';
    if (['block', 'inline-block', 'flex', 'grid'].includes(keys[0])) {
      layout = keys.shift(); // removes the layout from the keys list
    }
  
    keys.forEach(key => {
      if (elements[key]) {
        elements[key].style.display = layout;
      }
    });
  };  

  // Player Factory
  const createPlayer = (name, symbol) => {
    return { name, symbol, wins: 0 };
  };

  // Game Logic
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
    setTextContent({
      message: `It's your turn, ${currentPlayer.name}`,
    });
  };

  const resetGame = () => {
    board.fill('');
    elements.squares.forEach(square => {
      square.textContent = '';
      square.classList.remove('win-effect', 'draw-effect');
    });
    turnNumber = 0;
    gameOver = false;

    if (currentPlayer) {
      setTextContent({ message: `Game reset! It's your turn, ${currentPlayer.name}` });
    }
  };

  const checkWin = () => {
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
      [0, 4, 8], [2, 4, 6]              // diagonals
    ];
  
    for (const [a, b, c] of winningCombos) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return [a, b, c];
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
      setTextContent({
        playerOneScore: `${playerOne.name}: ${playerOne.wins}`,
      });
    } else if (player === playerTwo) {
      setTextContent({
        playerTwoScore: `${playerTwo.name}: ${playerTwo.wins}`,
      });
    }
  };

  const highlightSquares = (combo) => {
    combo.forEach(index => {
      elements.squares[index].classList.add('win-effect');
    });
  };

  const endGame = (resultText) => {
    currentPlayer = null;
    gameOver = true;
    setTextContent({ message: resultText });
    hideElements('resetButton');
    showElements('inline-block', 'playAgainButton');
  };

  const launchConfetti = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;
  
    (function frame() {
      confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 } });
  
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const applyDrawEffect = () => {
    elements.squares.forEach(square => {
      square.classList.add('draw-effect');
    });
  };

  // Create DOM Elements
  const createElements = () => {
    Object.entries(elementDefinitions).forEach(([tag, keys]) => {
      keys.forEach((key) => {
        const el = document.createElement(tag);
        const kebab = camelToKebab(key);
        el.classList.add(kebab);
        el.id = kebab;
        elements[key] = el;
      });
    });
  };

  const createSquares = () => {
    for (let i = 0; i < 9; i++) {
      const square = document.createElement('div');
      square.classList.add('game-square');
      square.dataset.index = i;
      square.id = `square-${i}`;
      elements.squares.push(square);
      elements.gameBoardContainer.append(square); // assumes this container is already created
    }
  };

  const renderUI = () => {
    const {
      title,
      messageContainer,
      message,
      playersContainer,
      playerOneInput,
      playerTwoInput,
      startButton,
      gameOverlay,
      gameBoardWrapper,
      gameBoardContainer,
      bottomBar,
      resetButton,
      playAgainButton,
      scoreboard,
      playerOneScore,
      playerTwoScore,
    } = elements;

    messageContainer.append(message);
    playersContainer.append(playerOneInput, playerTwoInput);
    gameOverlay.append(playersContainer, startButton);
    gameBoardWrapper.append(gameBoardContainer, gameOverlay);
    bottomBar.append(resetButton, playAgainButton, scoreboard);
    scoreboard.append(playerOneScore, playerTwoScore);
    document.body.append(title, messageContainer, gameBoardWrapper, bottomBar);
  }

  // Handle Events
  const handleStartClick = () => {
    playerOne = createPlayer(elements.playerOneInput.value || 'Player One', 'X');
    playerTwo = createPlayer(elements.playerTwoInput.value || 'Player Two', 'O');
    currentPlayer = playerOne;
    lastStartingPlayer = playerOne;
    resetGame();
    setTextContent({
      playerOneScore: `${playerOne.name}: ${playerOne.wins}`,
      playerTwoScore: `${playerTwo.name}: ${playerTwo.wins}`,
      message: `It's your turn, ${currentPlayer.name}`,
    });
    elements.gameOverlay.classList.add('fade-out');
    setTimeout(() => {
      hideElements('gameOverlay');
    }, 400);
    showElements('flex', 'bottomBar');
  };
  
  const handlePlayAgainClick = () => {
    if (lastStartingPlayer === playerOne) {
      currentPlayer = playerTwo;
    } else {
      currentPlayer = playerOne;
    }
    lastStartingPlayer = currentPlayer;

    resetGame();

    setTextContent({ message: `It's your turn first this time, ${currentPlayer.name}!` });

    showElements('inline-block', 'resetButton');
    hideElements('playAgainButton');
  };
  
  const handleSquareClick = (event) => {
    if (gameOver || !currentPlayer || event.target.textContent) return;
  
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
        applyDrawEffect();
        endGame(`It's a draw!`);
      } else {
        toggleTurn();
      }
    }
  };

  const attachEventListeners = () => {
    elements.startButton.addEventListener('click', handleStartClick);
    elements.resetButton.addEventListener('click', resetGame);
    elements.playAgainButton.addEventListener('click', handlePlayAgainClick);
  
    elements.squares.forEach(square => {
      square.addEventListener('click', handleSquareClick);
    });
  };

  // Run the application
  const initialiseGame = () => {
    createElements();
    setTextContent({
      title: 'Tic Tac Toe',
      startButton: 'Start Game',
      resetButton: 'Reset Game',
      playAgainButton: 'Play Again',
      playerOneScore: 'Player One: 0',
      playerTwoScore: 'Player Two: 0',
    });
    configureInput(elements.playerOneInput, 'playerOneName', 'Player One');
    configureInput(elements.playerTwoInput, 'playerTwoName', 'Player Two');
    hideElements('bottomBar', 'playAgainButton');
    renderUI();
    createSquares();
    attachEventListeners();
  }

initialiseGame(); // Start the game

})();
