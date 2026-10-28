/*****************************************************************************
 * ╔═══╤═══╤═══╦═══╤═══╤═══╦═══╤═══╤═══╗                                     *
 * ║   │   │   ║   │   │   ║   │   │   ║                                     *
 * ╟───┼───┼───╫───┼───┼───╫───┼───┼───╢                                     *
 * ║   │   │   ║   │   │   ║   │   │   ║                                     *
 * ╟───┼───┼───╫───┼───┼───╫───┼───┼───╢                                     *
 * ║ 2 │ 3 │ 4 ║   │   │   ║ 5 │ 6 │ 7 ║                                     *
 * ╚═══╧═══╧═══╩═══╧═══╧═══╩═══╧═══╧═══╝                                     *
 * In the above example, the bottom row of the middle subgrid is the ONLY    *
 * ROW that can still be populated by a 1. Naturally, the same principle     *
 * applies for the veritcal case.                                            *
 *****************************************************************************/

// TODO: Simplify. Row and col cases have a lot of overlap, thus functions 
// should be restructured.
export function onlys(oldNotes: Array<Array<number>>): Array<Array<number>> {
    let notes = oldNotes.map(r => [...r]);

    notes = only_row(notes);
    notes = only_col(notes);

    return notes;
}

// TODO: Support other grid sizes than 9x9
function only_row(notes: Array<Array<number>>): Array<Array<number>> {
    const sg_height = 3;
    const sg_len = notes.length;

    for (let row = 0; row < sg_len; ++row) {
        for (let n = 0; n < sg_len; ++n) {
            let loc = -1; // detected horizontal location of "only row"
            for (let col = 0; col < sg_len; ++col) {

                // check for fitting notes
                if (notes[row][col] & 2 ** n) {
                    // note down possible candidate
                    if (loc == -1) {
                        loc = Math.trunc(col/sg_height);
                        continue;
                    }
                    // multiple "candidates" found => no candidate
                    if (loc != Math.trunc(col/sg_height)) {
                        loc = -1;
                        break;
                    }
                }
            }
            // candidate found, update subgrid
            if (loc != -1) {
                notes = update_subgrid_row(notes, row, loc, n);
            }
        }
    }
    return notes;
}

// TODO: Support other grid sizes than 9x9
function only_col(notes: Array<Array<number>>): Array<Array<number>> {
    const sg_width = 3;
    const sg_len = notes.length;

    for (let col = 0; col < sg_len; ++col) {
        for (let n = 0; n < sg_len; ++n) {
            let loc = -1; // detected horizontal location of "only column"
            for (let row = 0; row < sg_len; ++row) {

                // check for fitting notes
                if (notes[row][col] & 2 ** n) {
                    // note down possible candidate
                    if (loc == -1) {
                        loc = Math.trunc(row/sg_width);
                        continue;
                    }
                    // multiple "candidates" found => no candidate
                    if (loc != Math.trunc(row/sg_width)) {
                        loc = -1;
                        break;
                    }
                }
            }
            // candidate found, update subgrid
            if (loc != -1) {
                notes = update_subgrid_col(notes, loc, col, n);
            }
        }
    }
    return notes;
}

/* notes: 2D array of all notes
 * row: The row that was identified as "only row"
 * sg_col: The column INDEX of the subgrid in which the "only row" was found 
 * n: The number for which the "only row" was found
**/
function update_subgrid_row(notes: Array<Array<number>>, row: number, sg_col: number, n: number): Array<Array<number>> {
    const sg_width = 3;
    const sg_height = 3;
    const sg_row = Math.trunc(row/sg_height);

    for (let i = 0; i < sg_width; ++i) {
        for (let j = 0; j < sg_height; ++j) {
            // exclude "only row"
            if (sg_row * 3 + i != row) {
                notes[sg_row * 3 + i][sg_col * 3 + j] &= ~(2 ** n);
            }
        }
    }
    
    return notes;
}

/* notes: 2D array of all notes
 * sg_row: The row INDEX of the subgrid in which the "only column" was found 
 * col: The column that was identified as "only column"
 * n: The number for which the "only column" was found
**/
function update_subgrid_col(notes: Array<Array<number>>, sg_row: number, col: number, n: number): Array<Array<number>> {
    const sg_width = 3;
    const sg_height = 3;
    const sg_col = Math.trunc(col/sg_width);

    for (let i = 0; i < sg_width; ++i) {
        for (let j = 0; j < sg_height; ++j) {
            // exclude "only column"
            if (sg_col * 3 + j != col) {
                notes[sg_row * 3 + i][sg_col * 3 + j] &= ~(2 ** n);
            }
        }
    }
    
    return notes;
}