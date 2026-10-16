/*****************************************************************************
 * Before:                                                                   *
 * ╔═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╗ *
 * ║       │       │ 1     │       │       │       │ 1     │       │       ║ *
 * ║       │       │       │       │       │       │       │       │       ║ *
 * ║       │       │       │       │       │       │       │       │       ║ *
 * ╟───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────╢ *
 * ║ 1     │ 1     │ 1     │ 1     │ 1     │ 1     │ 1     │ 1     │ 1     ║ *
 * ║       │       │       │       │       │       │       │       │       ║ *
 * ║       │       │       │       │       │       │       │       │       ║ *
 * ╟───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────╢ *
 * ║       │       │ 1     │       │       │       │ 1     │       │       ║ *
 * ║       │       │       │       │       │       │       │       │       ║ *
 * ║       │       │       │       │       │       │       │       │       ║ *
 * ╚═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╝ *
 * This is a strat, I actually didn't come up with myself, but I will try to *
 * explain it here anyways. When there's two rows (without loss of           *
 * generality) that contain only two possible spots left for a number, then  *
 * all other rows within that column can be cleared of that number.          *
 * In theory (and this is already me thinking for myself again) the same     *
 * principle should apply given three (four, five, ...) spots in three       *
 * (four, five, ...) rows. In practice however, that would more difficult to *
 * implement.                                                                *
 *                                                                           *
 * After:                                                                    *
 * ╔═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╗ *
 * ║       │       │ 1     │       │       │       │ 1     │       │       ║ *
 * ║       │       │       │       │       │       │       │       │       ║ *
 * ║       │       │       │       │       │       │       │       │       ║ *
 * ╟───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────╢ *
 * ║ 1     │ 1     │       │ 1     │ 1     │ 1     │       │ 1     │ 1     ║ *
 * ║       │       │       │       │       │       │       │       │       ║ *
 * ║       │       │       │       │       │       │       │       │       ║ *
 * ╟───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────╢ *
 * ║       │       │ 1     │       │       │       │ 1     │       │       ║ *
 * ║       │       │       │       │       │       │       │       │       ║ *
 * ║       │       │       │       │       │       │       │       │       ║ *
 * ╚═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╝ *
 *****************************************************************************/

// TODO: Generalize for triplets, etc.
// TODO: Row and col cases have some overlap, consider restructure.
export function xwings(oldNotes: Array<Array<number>>): Array<Array<number>> {
    let notes = oldNotes.map(r => [...r]);

    notes = xwing_row(notes);
    notes = xwing_col(notes);

    return notes;
}

function xwing_row(notes: Array<Array<number>>): Array<Array<number>> {
    for (let n = 0; n < notes.length; ++n) {
        for (let row = 0; row < notes.length; ++row) {
            let pos1 = -1;
            let pos2 = -1;
            for (let col = 0; col < notes.length; ++col) {
                if(notes[row][col] & 2 ** n) {
                    if (pos1 == -1) {
                        pos1 = col;
                        continue;
                    }
                    if (pos2 == -1) {
                        pos2 = col;
                        continue;
                    } else {
                        pos2 = -1;
                        break;
                    }
                }
            }
            if (pos2 != -1 && row < notes.length-1) {
                const other_row = find_other_row(notes, row, pos1, pos2, n);
                if (other_row != -1) {
                    notes = adjust_notes_row(notes, row, other_row, pos1, pos2, n);
                }
            }
        }
    }

    return notes;
}

function xwing_col(notes: Array<Array<number>>): Array<Array<number>> {
    for (let n = 0; n < notes.length; ++n) {
        for (let col = 0; col < notes.length; ++col) {
            let pos1 = -1;
            let pos2 = -1;
            for (let row = 0; row < notes.length; ++row) {
                if(notes[row][col] & 2 ** n) {
                    if (pos1 == -1) {
                        pos1 = row;
                        continue;
                    }
                    if (pos2 == -1) {
                        pos2 = row;
                        continue;
                    } else {
                        pos2 = -1;
                        break;
                    }
                }
            }
            if (pos2 != -1 && col < notes.length-1) {
                const other_col = find_other_col(notes, pos1, pos2, col, n);
                if (other_col != -1) {
                    notes = adjust_notes_col(notes, pos1, pos2, col, other_col, n);
                }
            }
        }
    }

    return notes;
}

/* notes: 2D array of all notes
 * starting_row: Searching rows above does not make sense as they would only 
 *               contain already found xwings
 * pos1: First column where a set note has to be found
 * pos2: Second column where a set note has to be found
 * n: number for which the xwing shall be detected
**/
function find_other_row(notes: Array<Array<number>>, starting_row: number, pos1: number, pos2: number, n: number): number {
    // Start with starting_row+1, or else you would
    // immediately find the same row again
    for (let row = starting_row+1; row < notes.length; ++row) {
        let valid = true;
        for (let col = 0; col < notes.length; ++col) {
            // Compact logic that essentially instructs to cancel the search
            // as soon as an unfitting note has been detected
            if (Boolean(notes[row][col] & (2 ** n)) != (col == pos1 || col == pos2)) {
                valid = false;
                break;
            }
        }
        if (valid) {
            return row;
        }
    }

    return -1;
}

/* notes: 2D array of all notes
 * pos1: First row where a set note has to be found
 * pos2: Second row where a set note has to be found
 * starting_col: Searching columns to the left does not make sense as they
 *               would only contain already found xwings
 * n: number for which the xwing shall be detected
**/
function find_other_col(notes: Array<Array<number>>, pos1: number, pos2: number, starting_col: number, n: number): number {
    // Start with starting_col+1, or else you would
    // immediately find the same column again
    for (let col = starting_col+1; col < notes.length; ++col) {
        let valid = true;
        for (let row = 0; row < notes.length; ++row) {
            // Compact logic that essentially instructs to cancel the search
            // as soon as an unfitting note has been detected
            if (Boolean(notes[row][col] & (2 ** n)) != (row == pos1 || row == pos2)) {
                valid = false;
                break;
            }
        }
        if (valid) {
            return col;
        }
    }

    return -1;
}

/* notes: 2D array of all notes
 * row1: First row with two set notes
 * row2: Second row with two set notes
 * pos1: First column where a set note was found
 * pos2: Second column where a set note was found
 * n: number for which the xwing was detected
**/
function adjust_notes_row(notes: Array<Array<number>>, row1: number, row2: number, pos1: number, pos2: number, n: number): Array<Array<number>> {
    // Delete all notes for this number in the column of the xwing
    for (let row = 0; row < notes.length; ++row) {
        // Leave out the rows where the xwing sits
        if (row != row1 && row != row2) {
            notes[row][pos1] &= ~(2 ** n);
            notes[row][pos2] &= ~(2 ** n);
        }
    }

    return notes;
}

/* notes: 2D array of all notes
 * pos1: First row where a set note was found
 * pos2: Second row where a set note was found
 * col1: First column with two set notes
 * col2: Second column with two set notes
 * n: number for which the xwing was detected
**/
function adjust_notes_col(notes: Array<Array<number>>, pos1: number, pos2: number, col1: number, col2: number, n: number): Array<Array<number>> {
    // Delete all notes for this number in the row of the xwing
    for (let col = 0; col < notes.length; ++col) {
        // Leave out the columns where the xwing sits
        if (col != col1 && col != col2) {
            notes[pos1][col] &= ~(2 ** n);
            notes[pos2][col] &= ~(2 ** n);
        }
    }

    return notes;
}