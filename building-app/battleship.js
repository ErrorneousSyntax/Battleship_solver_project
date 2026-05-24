const Battleship = {}

//----------------------- CONSTANTS -----------------------

Battleship.BOARD_SIZE = 10;

Battleship.CELL = {
  EMPTY: "empty",
  SHIP: "ship",
  MISS: "miss",
  HIT: "hit",
  SUNK: "sunk"
};

Battleship.SHIP_TYPE = {
  CARRIER: { name: "carrier", length: 5 },
  BATTLESHIP: { name: "battleship", length: 4 },
  CRUISER: { name: "cruiser", length: 3 },
  SUBMARINE: { name: "submarine", length: 3 },
  DESTROYER: { name: "destroyer", length: 2 }
};

Battleship.ORIENTATION = {
  VERTICAL: "vertical",
  HORIZONTAL: "horizontal"
};

Battleship.PHASE = {
  MENU: "menu",
  SETUP: "setup",
  FIRING: "firing",
  DEFENDING: "defending",
  GAME_OVER: "game_over"
};

Battleship.PLAYER_TYPE = {
  RANDOM: "random",
  HUNT: "hunt"
};


//----------------------- INITIALISING GAME -----------------------


/**
 * Creates a new empty grid of size board_size x board_size
 * @returns {string[][]} new grid
 */
Battleship.createEmptyBoard = function (){
  const board=[];
  for (let row=0;row<Battleship.BOARD_SIZE;row++){
    const currentRow=[]
    for (let col=0;col<Battleship.BOARD_SIZE;col++){
      currentRow.push(cell.EMPTY)
    }
    board.push(currentRow)
  }
  return board
}

/**
 * Defines the name, length and initialises cells and hit cells for 
 * each ship in a fleet 
 * @param {Object} shipType
 * @returns {Object} ship
 */
Battleship.createShip = function (shipType){
  return{
    name:shipType.name,
    length:shipType.length,
    cells:[],
    hits:[],
    sunk:false
  }
}

/**
 * Initialises the fleet, with consideration for every ship on the board
 * @returns {Array} fleet
 */
Battleship.createInitialFleet = function(){
  return [
    Battleship.createShip(Battleship.SHIP_TYPE.CARRIER),
    Battleship.createShip(Battleship.SHIP_TYPE.BATTLESHIP),
    Battleship.createShip(Battleship.SHIP_TYPE.CRUISER),
    Battleship.createShip(Battleship.SHIP_TYPE.SUBMARINE),
    Battleship.createShip(Battleship.SHIP_TYPE.DESTROYER)
  ]
}


/**
 * Creates the full initial state for a new Battleship game.
 *
 * The state object should contain all data needed to run the game:
 * player boards, computer boards, fleets, shot-tracking boards,
 * current phase, current turn, winner, and AI memory.
 *
 * @returns {Object} Initial game state.
 */
Battleship.createInitialGameState = function(){
  return {
    playerBoard: Battleship.createEmptyBoard(),
    computerBoard: Battleship.createEmptyBoard(),

    playerFleet: Battleship.createInitialFleet(),
    computerFleet: Battleship.createInitialFleet(),

    /* Grid for shots visualisation */
    playerShots: Battleship.createEmptyBoard(),
    computerShots: Battleship.createEmptyBoard(),

    phase: Battleship.PHASE.MENU,
    turn: "player",
    winner: null
  }
}

//----------------------- HELPER FUNCTIONS -----------------------


/**
 * Checks that selected row and colum is within the boundaries
 *
 * @param {number} row  Row index.
 * @param {number} col  Column index.
 * @returns {boolean} True if the position is inside the board.
 */
Battleship.cellIsInisideBoard = function(row, col){
  return (row>=0 && row<Battleship.BOARD_SIZE && col >=0 && col <=Battleship.BOARD_SIZE)
}

/**
 * Gets the value stored at a specific board position, and returns
 * null instead of crash if the cell does not exist
 * 
 * @param {string[][]} board  The board to read from.
 * @param {number} row Row index.
 * @param {number} col  Column index.
 * @returns {string|null} Cell value if inside board, otherwise null.
 */
Battleship.getCell = function(board, row, col){
  if (Battleship.cellIsInisideBoard(row,col) != true){
    return null
  }
  return board[row][col]
}

/**
 * Sets specific cell on the board to a certain value
 * 
 * @param {string[][]} board  The board to read from.
 * @param {number} row Row index.
 * @param {number} col  Column index.
 * @param {string} Cell value to be set to 
 * @returns {string[][]} board New board that has been set.
 */
Battleship.setCell = function(board,row,col,value){
  if (Battleship.cellIsInisideBoard(row,col) != true){
    return board
  }
  /* Ensuring functional programming paradigms */
  return board.map(function(currentRow,r){
    return currentRow.map(function(currentCell, c){
      if (r === row && c == col){
        return value
      }
      return currentCell
    })
  })
}

/**
 * Returns every cell coordinate on the board.
 *
 * @param {string[][]} board  Board to inspect.
 * @returns {{ row: number, col: number }[]} Array of board coordinates.
 */
Battleship.getAllCells = function (board) {
  const arr = []
  // loop through every row
  for (let row=0; row<board.length; row++){
    for (let col=0; col<board[row].length; col++){
      arr.push({"row": row,"col":col})
    }
  return arr
  }
}

/**
 * Finds the cell id of adjacant cells
 * 
 * @param {{ row: number, col: number }} cellPosition  The centre cell.
 */
Battleship.getAdjacentCells = function(cellPosition){
  const possibleCells = [
    { row: cellPosition.row - 1, col: cellPosition.col }, 
    { row: cellPosition.row + 1, col: cellPosition.col }, 
    { row: cellPosition.row, col: cellPosition.col - 1 }, 
    { row: cellPosition.row, col: cellPosition.col + 1 }  
  ]


  return possibleCells.filter(function(cell){
    return Battleship.cellIsInisideBoard(cell.row,cell.col)
  })
}


//----------------------- SHIP PLACEMENT -----------------------


/**
 * Finds the board cells occupied by a ship from a starting position.
 *
 * This function does not modify the board. It only returns the coordinates
 * the ship would occupy based on its length and orientation.
 *
 * @param {{ row: number, col: number }} cellPosition  Starting cell of the ship.
 * @param {{ name: string, length: number }} ship  Ship object containing length.
 * @param {string} orientation  Ship orientation: horizontal or vertical.
 * @returns {{ row: number, col: number }[]} Array of cells occupied by the ship.
 */
Battleship.getShipCells = function(cellPosition, ship, orientation){
  const cells = [];

  for (let i=0; i<ship.length; i++){
    if (orientation === Battleship.ORIENTATION.HORIZONTAL){
      cells.push({"row":cellPosition.row, "col": cellPosition.col+i})
    }
    else if (orientation === Battleship.ORIENTATION.VERTICAL){
      cells.push({"row":cellPosition.row+i, "col": cellPosition.col})
    }
  }
  return cells
}

/**
 * Returns true or false on if a ship can be placed on that cel
 * 
 * @param {string[][]} board the current board
 * @param {{ name: string, length: number }} ship  Ship object containing length.
 * @param {{ row: number, col: number }} Cell 
 * 
 * @returns {boolean} if the ship can be placed or not
 */
Battleship.canPlaceShip = function(board, ship, startCell, orientation){
  // find the cells the ship would occupy
  const shipCells = Battleship.getShipCells(startCell,ship,orientation)

  //check each cell 
  for (const cell of shipCells){
    if (!Battleship.cellIsInisideBoard(cell.row, cell.col) 
      || Battleship.getCell(board,cell.row,cell.col) !== Battleship.CELL.EMPTY){
      return false
    }
  }
  return true
}



/**
 * Places a ship on the board if the placement is valid.
 * returns a new board and an updated ship object
 *
 * @param {string[][]} board  board current
 * @param {Object} ship  ship object to place.
 * @param {{ row: number, col: number }} startCell starting cell
 * @param {string} orientation  horizontal or vertical
 * @returns {{ board: string[][], ship: Object } | null} Updated board and ship, or null if invalid.
 */
Battleship.placeShip = function (board, ship, startCell, orientation) {
  if (!Battleship.canPlaceShip(board, ship, startCell, orientation)){
    return null
  }
  const shipCells = Battleship.getShipCells(startCell, ship, orientation)

  let newBoard = board
  
  for (const cell of shipCells){
    newBoard = Battleship.setCell(newBoard, cell.row,cell.col,Battleship.CELL.SHIP)
  }

  const updatedShip = {
    name: ship.name,
    length: ship.length,
    hits: ship.hits,
    sunk: ship.sunk,
    cells:shipCells
  }

  return {board: newBoard, updatedShip}
}



// placeFleetRandomly(board, fleet)
/**
 * Randomly place fleet on the board
 * 
 * @param {string[][]} board current board
 * @param {Object} fleet Fleet of ships
 * @returns {{ board: string[][], fleet: Object[] }} updated board and fleet
 */
Battleship.placeFleetRandomly = function(board, fleet){
  // Assign a new board variable and new placedFleet variable
  let newBoard=board
  const placedFleet = [];

  // Use Math.random to find a starting cell 
  for (const ship of fleet){
    let allPlaced = false
    while (allPlaced != true){
      //Random starting cell:
      const row = Math.floor(Math.random() * Battleship.BOARD_SIZE);
      const col = Math.floor(Math.random() * Battleship.BOARD_SIZE);
      const startCell = {row, col}

      //Random orientation
      const getRandomOrientation = () => {
        const randomNumber = Math.round(Math.random());

        if (randomNumber === 1) {
          return Battleship.ORIENTATION.HORIZONTAL;
        } else {
          return Battleship.ORIENTATION.VERTICAL;
        }
      }

      const orientation = getRandomOrientation();

      const result = Battleship.placeShip(newBoard,ship,startCell,orientation)

      if (result !== null) {
        newBoard = result.board;
        placedFleet.push(result.ship);
        allPlaced = true;
      }
    }
  }

  return {
    board: newBoard,
    fleet: placedFleet
  };
};



//----------------------- SHOT LOGIC -----------------------


// hasAlreadyBeenShot(shotsBoard, cell)
// resolveShot(targetBoard, targetFleet, cell)
// markShot(shotsBoard, cell, result)
// isShipHit(ship, cell)
// isShipSunk(ship, shotsBoard)
// areAllShipsSunk(fleet, shotsBoard)


// ==========================
// GAME FLOW
// ==========================

// startGame(state)
// switchTurn(state)
// handlePlayerShot(state, cell)
// handleComputerTurn(state)
// checkGameOver(state)


// ==========================
// RANDOM AI
// ==========================

// getAvailableShots(shotsBoard)
// chooseRandomShot(shotsBoard)


// ==========================
// HUNT / TARGET AI
// ==========================

// createAIMemory()
// chooseHuntTargetShot(shotsBoard, aiMemory)
// huntMode(shotsBoard)
// targetMode(shotsBoard, aiMemory)
// updateAIMemory(aiMemory, shotResult)


// ==========================
// HEATMAP ALGORITHM
// ==========================

// createEmptyHeatmap()
// generateHeatmap(shotsBoard, remainingShips)
// getAllPossiblePlacements(shipLength)
// isValidHeatmapPlacement(placement, shotsBoard)
// scorePlacement(placement, shotsBoard)
// normaliseHeatmap(heatmap)


// ==========================
// EXPORTS
// ==========================

// export functions needed by main.js / UI layer
