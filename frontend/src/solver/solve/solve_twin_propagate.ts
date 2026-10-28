// Propagate already isolated "twins" within their row/column/subgrid
// TODO: Generalize for triplets, etc.
export function propagate_twins(oldNotes: Array<Array<number>>): Array<Array<number>> {
    let notes = oldNotes.map(r => [...r]);

    for (let row = 0; row < notes.length; ++row) {
        for (let col = 0; col < notes.length; ++col) {
            if (count_set_notes(notes[row][col]) == 2) {
                notes = search_row(notes, notes[row][col], row, col);
                notes = search_col(notes, notes[row][col], row, col);
                notes = search_subgrid(notes, notes[row][col], row, col);
            }
        }
    }

    return notes;
}

// Returns the amount of bits set to 1 within a number
// Theoretically I could also optimize this to simply return whether or not two
// notes have been set in a tile
function count_set_notes(note: number): number {
    let cnt = 0;

    while (note > 0) {
        cnt += note & 1;
        note >>= 1;
    }

    return cnt;
}

/*****************************************************************************
 * ╔═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╗ *
 * ║ 1 2   │ 1 2   │ 1 2 3 │ 1 2 3 │ 1 2 3 │ 1 2 3 │ 1 2 3 │ 1 2 3 │ 1 2 3 ║ *
 * ║       │       │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 ║ *
 * ║       │       │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 ║ *
 * ╚═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╝ *
 * When only two numbers are possible in two fields of a row/column, they    *
 * automatically become impossible in all other tiles of said row/column:    *
 * ╔═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╗ *
 * ║ 1 2   │ 1 2   │     3 │     3 │     3 │     3 │     3 │     3 │     3 ║ *
 * ║       │       │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 ║ *
 * ║       │       │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 ║ *
 * ╚═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╝ *
 *****************************************************************************/

// TODO: Simplify. Row and col cases have a lot of overlap, thus functions 
// should be restructured.
function search_row(notes: Array<Array<number>>, note: number, row: number, note_col: number): Array<Array<number>> {
    for (let col = 0; col < notes.length; ++col) {
        // Skip already known isolated twin and find twin
        if (col != note_col && notes[row][col] == note) {
            return propagate_row(notes, note, row);
        }
    }

    return notes;
}

function search_col(notes: Array<Array<number>>, note: number, note_row: number, col: number): Array<Array<number>> {
    for (let row = 0; row < notes.length; ++row) {
        // Skip already known isolated twin and find twin
        if (row != note_row && notes[row][col] == note) {
            return propagate_col(notes, note, col);
        }
    }

    return notes;
}

/*****************************************************************************
 * ╔═══════╤═══════╤═══════╗                       ╔═══════╤═══════╤═══════╗ *
 * ║ 1 2   │ 1 2 3 │ 1 2 3 ║                       ║ 1 2   │     3 │     3 ║ *
 * ║       │ 4 5 6 │ 4 5 6 ║                       ║       │ 4 5 6 │ 4 5 6 ║ *
 * ║       │ 7 8 9 │ 7 8 9 ║                       ║       │ 7 8 9 │ 7 8 9 ║ *
 * ╟───────┼───────┼───────╢                       ╟───────┼───────┼───────╢ *
 * ║ 1 2 3 │ 1 2   │ 1 2 3 ║                       ║     3 │ 1 2   │     3 ║ *
 * ║ 4 5 6 │       │ 4 5 6 ║          ==>          ║ 4 5 6 │       │ 4 5 6 ║ *
 * ║ 7 8 9 │       │ 7 8 9 ║                       ║ 7 8 9 │       │ 7 8 9 ║ *
 * ╟───────┼───────┼───────╢                       ╟───────┼───────┼───────╢ *
 * ║ 1 2 3 │ 1 2 3 │ 1 2 3 ║                       ║     3 │     3 │     3 ║ *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║                       ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║ *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║                       ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║ *
 * ╚═══════╧═══════╧═══════╝                       ╚═══════╧═══════╧═══════╝ *
 * When only two numbers are possible in two fields of a subgrid, they       *
 * automatically become impossible in all other tiles of said subgrid.       *
 *****************************************************************************/

function search_subgrid(notes: Array<Array<number>>, note: number, note_row: number, note_col: number): Array<Array<number>> {
    const sg_width = 3;
    const sg_height = 3;

    const sg_row = Math.trunc(note_row / sg_height) * sg_height;
    const sg_col = Math.trunc(note_col / sg_width) * sg_width;
    
    for (let t = 0; t < notes.length; ++t) {
        const row = sg_row + Math.trunc(t/sg_width);
        const col = sg_col + t % sg_width;

        // Skip already known isolated twin and find twin
        if ((row != note_row || col != note_col) && notes[row][col] == note) {
            return propagate_subgrid(notes, note, sg_row, sg_col);
        }
    }
    return notes;
}

/* notes: 2D array of all notes
 * note: Value of the twin notes
 * row: Row in which the twins have been found
**/
function propagate_row(notes: Array<Array<number>>, note: number, row: number): Array<Array<number>> {
    for (let col = 0; col < notes.length; ++col) {
        if (notes[row][col] != note) {
            notes[row][col] &= ~note;
        }
    }

    return notes;
}

/* notes: 2D array of all notes
 * note: Value of the twin notes
 * col: Column in which the twins have been found
**/
function propagate_col(notes: Array<Array<number>>, note: number, col: number): Array<Array<number>> {
    for (let row = 0; row < notes.length; ++row) {
        if (notes[row][col] != note) {
            notes[row][col] &= ~note;
        }
    }

    return notes;
}

/* notes: 2D array of all notes
 * note: Value of the twin notes
 * sg_row: Row coordinate of the upper-left corner of the processed subgrid
 * sg_col: Column coordinate of the upper-left corner of the processed subgrid
**/
function propagate_subgrid(notes: Array<Array<number>>, note: number, sg_row: number, sg_col: number): Array<Array<number>> {
    const sg_width = 3;

    for (let t = 0; t < notes.length; ++t) {
        const row = sg_row + Math.trunc(t/sg_width);
        const col = sg_col + t % sg_width;

        if (notes[row][col] != note) {
            notes[row][col] &= ~note;
        }
    }

    return notes;
}