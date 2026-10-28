
/*****************************************************************************
 * ╔═══╤═══╤═══╦═══╤═══╤═══╦═══╤═══╤═══╗                                     *
 * ║ 2 │ 3 │ 4 ║   │   │   ║   │   │   ║                                     *
 * ╟───┼───┼───╫───┼───┼───╫───┼───┼───╢                                     *
 * ║   │   │   ║   │   │   ║   │   │   ║                                     *
 * ╟───┼───┼───╫───┼───┼───╫───┼───┼───╢                                     *
 * ║ 5 │ 6 │ 7 ║   │   │   ║   │   │   ║                                     *
 * ╚═══╧═══╧═══╩═══╧═══╧═══╩═══╧═══╧═══╝                                     *
 * In the above example, there can only be a 1 in the middle row of the      *
 * leftmost subgrid. Consequently, a 1 is impossible in the middle row of    *
 * the middle and rightmost subgrids.                                        *
 * I call this formation a "cannon", because I imagine placed numbers        *
 * "shooting" in all directions, restricting possibilites as they go. When a *
 * number is forced into a particular row or column, it effectively fires at *
 * the corresponding cells in neighboring subgrids, eliminating candidates   *
 * along its path. In my mind, this feels a bit like a number-ion cannon.    *
 * Naturally, there are two kinds of cannons: horizontal (row, pictured      *
 * above), and vertical (col).                                               *
 *****************************************************************************/

// TODO: Simplify. Row and col cases have a lot of overlap, thus functions 
// should be restructured.
// TODO: Consider making this part of the solver iterative, i.e. it runs 
// repeatedly until no new cannons are found anymore. Would also make at least
// parts of solve_last_pos obsolete.
export function cannons(oldNotes: Array<Array<number>>): Array<Array<number>> {
    let notes = oldNotes.map(r => [...r]);

    notes = cannon_row(notes);
    notes = cannon_col(notes);

    return notes;
}

// TODO: Support other grid sizes than 9x9
function cannon_row(notes: Array<Array<number>>): Array<Array<number>> {
    const sg_width = 3;
    const sg_height = 3;
    const sg_len = notes.length;

    // sg_row/sg_col increase in steps of sg_width/sg_height!
    // Therefore, sg_row/sg_col are not just the indices of the subgrid!
    for (let sg_row = 0; sg_row < sg_len; sg_row += sg_width) {
        for (let sg_col = 0; sg_col < sg_len; sg_col += sg_height) {
            for (let n = 0; n < sg_len; ++n) {
                let cannon_row = -1; // row number of detected cannon row
                for (let tile = 0; tile < sg_len; ++tile) {
                    // calculate current row/col
                    const row = sg_row + Math.trunc(tile/sg_width);
                    const col = sg_col + tile % sg_width;

                    // check for fitting notes
                    if (notes[row][col] & 2 ** n) {
                        // note down possible candidate
                        if (cannon_row == -1) {
                            cannon_row = row;
                            continue;
                        }
                        // multiple "candidates" found => no candidate
                        if (cannon_row != row) {
                            cannon_row = -1;
                            break;
                        }
                    }
                }
                // candidate found, update notes neighboring subgrids
                if (cannon_row != -1) {
                    notes = update_neighbor_sg_row(notes, cannon_row, Math.trunc(sg_col/sg_width), n);
                }
            }
        }
    }
    return notes;
}

// TODO: Support other grid sizes than 9x9
function cannon_col(notes: Array<Array<number>>): Array<Array<number>> {
    const sg_width = 3;
    const sg_height = 3;
    const sg_len = notes.length;

    // sg_row/sg_col increase in steps of sg_width/sg_height!
    // Therefore, sg_row/sg_col are not just the indices of the subgrid!
    for (let sg_row = 0; sg_row < sg_len; sg_row += sg_width) {
        for (let sg_col = 0; sg_col < sg_len; sg_col += sg_height) {
            for (let n = 0; n < sg_len; ++n) {
                let cannon_col = -1; // col number of detected cannon col
                for (let tile = 0; tile < sg_len; ++tile) {
                    // calculate current row/col
                    const row = sg_row + Math.trunc(tile/sg_width);
                    const col = sg_col + tile % sg_width;

                    // check for fitting notes
                    if (notes[row][col] & 2 ** n) {
                        // note down possible candidate
                        if (cannon_col == -1) {
                            cannon_col = col;
                            continue;
                        }
                        // multiple "candidates" found => no candidate
                        if (cannon_col != col) {
                            cannon_col = -1;
                            break;
                        }
                    }
                }
                // candidate found, update notes neighboring subgrids
                if (cannon_col != -1) {
                    notes = update_neighbor_sg_col(notes, Math.trunc(sg_row/sg_height), cannon_col, n);
                }
            }
        }
    }
    return notes;
}

/* notes: 2D array of all notes
 * row: The row in which a cannon was found and therefore has to be updated
 * sg_col: The column INDEX of the subgrid in which the cannon was found
 * n: The number for which the cannon was found
**/
function update_neighbor_sg_row(notes: Array<Array<number>>, row: number, sg_col: number, n: number): Array<Array<number>> {
    const sg_width = 3;

    for (let col = 0; col < notes.length; ++col) {
        // exclude subgrid where cannon was found
        if (Math.trunc(col/sg_width) != sg_col) {
            notes[row][col] &= ~(2 ** n);
        }
    }

    return notes;
}

/* notes: 2D array of all notes
 * sg_row: The row INDEX of the subgrid in which the cannon was found
 * col: The column in which a cannon was found and therefore has to be updated
 * n: The number for which the cannon was found
**/
function update_neighbor_sg_col(notes: Array<Array<number>>, sg_row: number, col: number, n: number): Array<Array<number>> {
    const sg_height = 3;

    for (let row = 0; row < notes.length; ++row) {
        // exclude subgrid where cannon was found
        if (Math.trunc(row/sg_height) != sg_row) {
            notes[row][col] &= ~(2 ** n);
        }
    }

    return notes;
}