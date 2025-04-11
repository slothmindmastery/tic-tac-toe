const gameboardFactory = (function () {
  const createGameboard = () => {
    // include array to store values of the nine squares
    let squares = Array(9).fill('empty');
    // include way of changing the value to circle/cross
    const changeValue = (input, squareNumber) => {
      if (squares[squareNumber] !== 'empty') {
      squares[squareNumber] = input;
      }
    };
    const renderGameboard = () => {
      const gameCanvas = document.createElement('div');
      gameCanvas.classList.add('game-canvas');
      document.body.appendChild(gameCanvas);
      const restartButton = document.createElement('button');
      restartButton.id = 'restartButton';
      restartButton.addEventListener('click', () => {
        // Reset squares array, Clear the visual board (wipe text from each square div) Reset turn tracking winner status - prompt for names?
      });
      document.body.appendChild(restartButton);

      for (let i = 0; i < 9; i++) {
        const gameSquare = document.createElement('div');
        gameSquare.classlist.add('game-square');
        gameSquare.setAttribute('data-index', i);
        gameSquare.addEventListener('click', (event) => {
          const squareNumber = event.target.dataset.index;
          const input = "not sure yet"; //find way to see if it is circles or crosses
          changeValue(input, squareNumber);
        });
        gameCanvas.appendChild(gameSquare);
      }
    }
    const refreshGameboard = () => {
      squares.forEach((value, index) => {
        const gameSquare = document.querySelector(`[data-index="${index}"]`);
        gameSquare.textContent = value;
      });
    };
    return { changeValue, renderGameboard, refreshGameboard }


  }
  /*
 

  include creating of divs in html with event listners (click -including start restart button
  include function to render values in html
  include function to start/restart game 
  */;
  const createPlayer =
  /*
  include name
  include whether crosses or circles
  include turn number
  include win status
  */
  const createGameMaster = (gameboard, playerOne, playerTwo)
  /*
  include - whose go is it (let)
  include whether players are crosses or circles

  prompt for player names / play as guess
  toss up to see who goes first
  whoever goes first is circles?
  loop - 
  prompt first go of whoever
  check for win/game over (all squares full)
  prompt to take turns alternate until someone wins
  
  */

  return { createGameboard, createPlayer, createGameMaster };

})






/* 


Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that shows the results upon game end! */