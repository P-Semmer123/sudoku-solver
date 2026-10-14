import { set_digit } from "../manage_notes";

// These functions cover cases where there's only one last posibility left for
// where a number can be placed and therefore place the number accordingly.

export function last_possibility(oldGrid: Array<Array<number>>, oldNotes: Array<Array<number>>): Array<Array<Array<number>>> {
    let grid = oldGrid.map(r => [...r]);
    let notes = oldNotes.map(r => [...r]);

    [grid, notes] = last_pos_in_tile(grid, notes);
    [grid, notes] = last_pos_in_row(grid, notes);
    [grid, notes] = last_pos_in_col(grid, notes);
    [grid, notes] = last_pos_in_subgrid(grid, notes);
    return [grid, notes];
}

/*****************************************************************************
 * ╔═══════╤═══════╤═══════╗                                                 *
 * ║ 1     │ 1 2 3 │ 1 2 3 ║                                                 *
 * ║       │ 4 5 6 │ 4 5 6 ║                                                 *
 * ║       │ 7 8 9 │ 7 8 9 ║                             ╔═══╤═══╤═══╗       *
 * ╟───────┼───────┼───────╢                             ║ 1 │   │   ║       *
 * ║ 1 2 3 │ 1 2 3 │ 1 2 3 ║                             ╟───┼───┼───╢       *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║             ==>             ║   │   │   ║       *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║                             ╟───┼───┼───╢       *
 * ╟───────┼───────┼───────╢                             ║   │   │   ║       *
 * ║ 1 2 3 │ 1 2 3 │ 1 2 3 ║                             ╚═══╧═══╧═══╝       *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║                                                 *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║                                                 *
 * ╚═══════╧═══════╧═══════╝                                                 *
 * If there's only one remaining note in a tile,                             *
 * "promote" that noted number to be the number in the grid.                 *
 *****************************************************************************/

function last_pos_in_tile(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    for (let row = 0; row < grid.length; ++row) {
        for (let col = 0; col < grid.length; ++col) {
            for (let n = 0; n < grid.length; ++n) {
                if (notes[row][col] == 2 ** n) {
                    [grid, notes] = set_digit(row, col, n+1, grid, notes);
                }
            }
        }
    }
    
    return [grid, notes];
}

/*****************************************************************************
 * ╔═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╗ *
 * ║ 1 2 3 │   2 3 │   2 3 │   2 3 │   2 3 │   2 3 │   2 3 │   2 3 │   2 3 ║ *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 ║ *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 ║ *
 * ╚═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╝ *
 * When a number can only be placed in a single tile of a row/column,        *
 * place it there.                                                           *
******************************************************************************/

// TODO: Row and col cases have some overlap, think again about restructure.
function last_pos_in_row(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    for (let row = 0; row < grid.length; ++row) {
        for (let n = 0; n < grid.length; ++n) {
            let pos = -1;
            for (let col = 0; col < grid.length; ++col) {
                if (notes[row][col] & 2 ** n) {
                    if (pos != -1) {
                        pos = -1;
                        break;
                    } else {
                        pos = col;
                    }
                }
            }
            if (pos != -1) {
                [grid, notes] = set_digit(row, pos, n+1, grid, notes);
            }
        }
    }

    return [grid, notes];
}

function last_pos_in_col(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    for (let col = 0; col < grid.length; ++col) {
        for (let n = 0; n < grid.length; ++n) {
            let pos = -1;
            for (let row = 0; row < grid.length; ++row) {
                if (notes[row][col] & 2 ** n) {
                    if (pos != -1) {
                        pos = -1;
                        break;
                    } else {
                        pos = row;
                    }
                }
            }
            if (pos != -1) {
                [grid, notes] = set_digit(pos, col, n+1, grid, notes);
            }
        }
    }

    return [grid, notes];
}

/*****************************************************************************
 * ╔═══════╤═══════╤═══════╗                                                 *
 * ║ 1 2 3 │   2 3 │   2 3 ║                                                 *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║                                                 *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║                             ╔═══╤═══╤═══╗       *
 * ╟───────┼───────┼───────╢                             ║ 1 │   │   ║       *
 * ║   2 3 │   2 3 │   2 3 ║                             ╟───┼───┼───╢       *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║             ==>             ║   │   │   ║       *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║                             ╟───┼───┼───╢       *
 * ╟───────┼───────┼───────╢                             ║   │   │   ║       *
 * ║   2 3 │ 1 2 3 │   2 3 ║                             ╚═══╧═══╧═══╝       *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║                                                 *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║                                                 *
 * ╚═══════╧═══════╧═══════╝                                                 *
 * When a number can only be placed in a single tile of a subgrid,           *
 * then place it there.                                                      *
 *****************************************************************************/

// TODO: Support other grid sizes than 9x9
function last_pos_in_subgrid(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    const sg_width = 3;
    const sg_height = 3;
    
    for (let sg_row = 0; sg_row < grid.length; sg_row += sg_height) {
        for (let sg_col = 0; sg_col < grid.length; sg_col += sg_width) {
            for (let n = 0; n < grid.length; ++n) {
                let loc_row = -1;
                let loc_col = -1;
                for (let i = 0; i < grid.length; ++i) {
                    const row = sg_row + Math.trunc(i/sg_height);
                    const col = sg_col + i % sg_width;
                    if (notes[row][col] & 2 ** n) {
                        if (loc_row != -1) {
                            loc_row = -1;
                            loc_col = -1;
                            break;
                        } else {
                            loc_row = row;
                            loc_col = col;
                        }
                    }
                }
                if (loc_row != -1) {
                    [grid, notes] = set_digit(loc_row, loc_col, n+1, grid, notes);
                }
            }
        }
    }
    
    return [grid, notes];
}