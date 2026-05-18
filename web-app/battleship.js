const Battleship = {}

Battleship.SIZE = 10

/**
 * @typedef {{ id: number, length: number, 
 * x: number, y: number, horizontal: boolean }} Battleship.ship
 */



Battleship.empty_board = function(){

}
    

/**
 * Place a ship onto the grid, returns a new grid, does not mutate.
 * @param {number[]}       grid grid pre change
 * @param {Battleship.ship} ship ship to be placed
 * @returns {number[]} new grid
 */
Battleship.place_ship = function (grid, ship) {
    const next = grid.slice();  // never reassigned — const
    for (let k = 0; k < ship.length; k++) {  // k changes each loop — let
        const cx = ship.horizontal ? ship.x + k : ship.x;  
        const cy = ship.horizontal ? ship.y : ship.y + k;  
        next[Battleship.to_index(cx, cy)] = ship.id;
    }
    return next;
};


/**
 * Checks if all ships are placed
 * @param {Battleship.grid} grid The grid we are checking
 * @returns {boolean} True or False
 */
Battleship.all_ships_placed = function(grid){

}


Battleship.is_grid_free = function(){

}

Battleship.is_hit = function(){

}

