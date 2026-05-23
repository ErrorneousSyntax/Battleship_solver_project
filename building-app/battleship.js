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
 * Gets the value stored at a specific board position.
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


// setCell(board, row, col, value)
// getAllCells(board)
// getAdjacentCells(cell)
// cloneBoard(board)


// ==========================
// SHIP PLACEMENT
// ==========================

// getShipCells(startCell, shipLength, orientation)
// canPlaceShip(board, ship, startCell, orientation)
// placeShip(board, ship, startCell, orientation)
// placeFleetRandomly(board, fleet)


// ==========================
// SHOT LOGIC
// ==========================

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
