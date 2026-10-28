export function propagate_triples(oldNotes: Array<Array<number>>): Array<Array<number>> {
    let notes = oldNotes.map(r => [...r]);

    notes = triple_row(notes);
    notes = triple_col(notes);
    notes = triple_subgrid(notes);

    return notes;
}

/*****************************************************************************
 * ╔═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╗ *
 * ║ 1 2   │ 1   3 │   2 3 │ 1 2 3 │ 1 2 3 │ 1 2 3 │ 1 2 3 │ 1 2 3 │ 1 2 3 ║ *
 * ║       │       │       │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 ║ *
 * ║       │       │       │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 ║ *
 * ╚═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╝ *
 * When there's three tiles that when combined only contain three different  *
 * notes, those three notes can be eliminated from all other tiles within    *
 * that row/column.                                                          *
 * ╔═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╗ *
 * ║ 1 2   │ 1   3 │   2 3 │       │       │       │       │       │       ║ *
 * ║       │       │       │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 ║ *
 * ║       │       │       │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 ║ *
 * ╚═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╝ *
 *****************************************************************************/

// TODO: Simplify. Row and col cases have a lot of overlap, thus functions 
// should be restructured.
function triple_row(notes: Array<Array<number>>): Array<Array<number>> {
    for (let row = 0; row < notes.length; ++row) {
        // Count amount of notes within each tile
        const tmp: Array<number> = [];
        for (let col = 0; col < notes.length; ++col) {
            tmp.push(count_set_notes(notes[row][col]));
        }
        
        const triples = generate_triples(tmp);
        // Won't run if no triples have been found:
        for (let i = 0; i < triples.length; ++i) {
            const triple = evaluate_triple_row(notes, triples[i], row);
            if (triple != -1) {
                notes = propagate_row(notes, row, triple, triples[i]);
            }
        }
    }

    return notes;
}

function triple_col(notes: Array<Array<number>>): Array<Array<number>> {   
    for (let col = 0; col < notes.length; ++col) {
        // Count amount of notes within each tile
        const tmp: Array<number> = [];
        for (let row = 0; row < notes.length; ++row) {
            tmp.push(count_set_notes(notes[row][col]));
        }
        
        const triples = generate_triples(tmp);
        // Won't run if no triples have been found:
        for (let i = 0; i < triples.length; ++i) {
            const triple = evaluate_triple_col(notes, triples[i], col);
            if (triple != -1) {
                notes = propagate_col(notes, col, triple, triples[i]);
            }
        }
    }

    return notes;
}

/*****************************************************************************
 * ╔═══════╤═══════╤═══════╗                       ╔═══════╤═══════╤═══════╗ *
 * ║ 1 2   │ 1   3 │ 1 2 3 ║                       ║ 1 2   │ 1   3 │       ║ *
 * ║       │       │ 4 5 6 ║                       ║       │       │ 4 5 6 ║ *
 * ║       │       │ 7 8 9 ║                       ║       │       │ 7 8 9 ║ *
 * ╟───────┼───────┼───────╢                       ╟───────┼───────┼───────╢ *
 * ║ 1 2 3 │   2 3 │ 1 2 3 ║                       ║       │ 1 2   │       ║ *
 * ║ 4 5 6 │       │ 4 5 6 ║          ==>          ║ 4 5 6 │       │ 4 5 6 ║ *
 * ║ 7 8 9 │       │ 7 8 9 ║                       ║ 7 8 9 │       │ 7 8 9 ║ *
 * ╟───────┼───────┼───────╢                       ╟───────┼───────┼───────╢ *
 * ║ 1 2 3 │ 1 2 3 │ 1 2 3 ║                       ║       │       │       ║ *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║                       ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║ *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║                       ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║ *
 * ╚═══════╧═══════╧═══════╝                       ╚═══════╧═══════╧═══════╝ *
 * When there's three tiles that when combined only contain three different  *
 * notes, those three notes can be eliminated from all other tiles within    *
 * that subgrid.                                                             *
 *****************************************************************************/

// TODO: Support other grid sizes than 9x9
function triple_subgrid(notes: Array<Array<number>>): Array<Array<number>> {
    const sg_height = 3;
    const sg_width = 3;

    for (let sg_row = 0; sg_row < notes.length; sg_row += sg_height) {
        for (let sg_col = 0; sg_col < notes.length; sg_col += sg_width) {
            // Count amount of notes within each tile
            const tmp: Array<number> = [];
            for (let t = 0; t < notes.length; ++t) {
                const row = sg_row + Math.trunc(t/sg_width);
                const col = sg_col + t % sg_width;
                tmp.push(count_set_notes(notes[row][col]));
            }
            
            const triples = generate_triples(tmp);
            // Won't run if no triples have been found:
            for (let i = 0; i < triples.length; ++i) {
                const triple = evaluate_triple_subgrid(notes, triples[i], sg_row, sg_col);
                if (triple != -1) {
                    notes = propagate_subgrid(notes, sg_row, sg_col, triple, triples[i]);
                }
            }
        }
    }
    

    return notes;
}

// Returns the amount of bits set to 1 within a number.
function count_set_notes(note: number): number {
    if (note == 0) {
        return 0;
    }

    let cnt = 0;

    while (note > 0) {
        cnt += note & 1;
        note >>= 1;
    }

    return cnt;
}

// cnts: Amount of note occurrences
function generate_triples(cnts: Array<number>): Array<Array<number>> {
    const cands: Array<number> = []; // cands -> candidates

    for (let i = 0; i < cnts.length; ++i) {
        if (cnts[i] == 2 || cnts[i] == 3) {
            cands.push(i);
        }
    }

    // There must be at least three numbers that have only two or three notes
    // for there to be a hidden triple
    if (cands.length < 3) {
        return [];
    }

    const triples: Array<Array<number>> = [];

    // Simple combinatorics...
    for (let i = 0; i < cands.length-2; ++i) {
        for (let j = i+1; j < cands.length-1; ++j) {
            for (let k = j+1; k < cands.length; ++k) {
                triples.push([cands[i], cands[j], cands[k]]);
            }
        }
    }

    return triples;
}

/* notes: 2D array of all notes
 * triple: Positions (columns) of the triple candidate
 * row: Row that shall be evaluated
**/
function evaluate_triple_row(notes: Array<Array<number>>, triple: Array<number>, row: number): number {
    // Combine notes of the triple...
    const tmp = notes[row][triple[0]] |
                notes[row][triple[1]] | 
                notes[row][triple[2]];

    // ...and check whether or not it actually makes a triple
    return (count_set_notes(tmp) == 3) ? tmp : -1;
}

/* notes: 2D array of all notes
 * triple: Positions (rows) of the triple candidate
 * col: Column that shall be evaluated
**/
function evaluate_triple_col(notes: Array<Array<number>>, triple: Array<number>, col: number): number {
    // Combine notes of the triple...
    const tmp = notes[triple[0]][col] |
                notes[triple[1]][col] | 
                notes[triple[2]][col];

    // ...and check whether or not it actually makes a triple
    return (count_set_notes(tmp) == 3) ? tmp : -1;
}

/* notes: 2D array of all notes
 * triple: Positions (tile indices) of the triple candidate
 * sg_row: Row coordinate of the upper-left corner of the evaluation subgrid
 * sg_col: Column coordinate of the upper-left corner of the evaluation subgrid
**/
function evaluate_triple_subgrid(notes: Array<Array<number>>, triple: Array<number>, sg_row: number, sg_col: number): number {
    const sg_width = 3;

    const row1 = sg_row + Math.trunc(triple[0]/sg_width);
    const row2 = sg_row + Math.trunc(triple[1]/sg_width);
    const row3 = sg_row + Math.trunc(triple[2]/sg_width);
    const col1 = sg_col + triple[0] % sg_width;
    const col2 = sg_col + triple[1] % sg_width;
    const col3 = sg_col + triple[2] % sg_width;

    // Combine notes of the triple...
    const tmp = notes[row1][col1] |
                notes[row2][col2] | 
                notes[row3][col3];
    
    // ...and check whether or not it actually makes a triple
    return (count_set_notes(tmp) == 3) ? tmp : -1;
}

/* notes: 2D array of all notes
 * row: Row that shall be processed
 * triple: Number with all three bits corresponding to the triple set to 1 
 * positions: Positions (columns) of the triple
**/
function propagate_row(notes: Array<Array<number>>, row: number, triple: number, positions: Array<number>): Array<Array<number>> {
    for (let col = 0; col < notes.length; ++col) {
        // Skip triple columns
        if (col != positions[0] && col != positions[1] && col != positions[2]) {
            notes[row][col] &= ~triple;
        }
    }

    return notes;
}

/* notes: 2D array of all notes
 * col: Column that shall be processed
 * triple: Number with all three bits corresponding to the triple set to 1 
 * positions: Positions (rows) of the triple
**/
function propagate_col(notes: Array<Array<number>>, col: number, triple: number, positions: Array<number>): Array<Array<number>> {
    for (let row = 0; row < notes.length; ++row) {
        // Skip triple rows
        if (row != positions[0] && row != positions[1] && row != positions[2]) {
            notes[row][col] &= ~triple;
        }
    }

    return notes;
}

/* notes: 2D array of all notes
 * sg_row: Row coordinate of the upper-left corner of the processed subgrid
 * sg_col: Column coordinate of the upper-left corner of the processed subgrid
 * triple: Number with all three bits corresponding to the triple set to 1 
 * positions: Positions (tile indices) of the triple
**/
function propagate_subgrid(notes: Array<Array<number>>, sg_row: number, sg_col: number, triple: number, positions: Array<number>): Array<Array<number>> {
    const sg_width = 3;
    
    for (let t = 0; t < notes.length; ++t) {
        // Skip triple tiles
        if (t != positions[0] && t != positions[1] && t != positions[2]) {
            const row = sg_row + Math.trunc(t/sg_width);
            const col = sg_col + t % sg_width;
            notes[row][col] &= ~triple;
        }
    }

    return notes;
}
