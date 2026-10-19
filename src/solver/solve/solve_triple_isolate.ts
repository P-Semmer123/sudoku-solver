export function isolate_triples(oldNotes: Array<Array<number>>): Array<Array<number>> {
    let notes = oldNotes.map(r => [...r]);

    notes = triple_row(notes);
    notes = triple_col(notes);
    notes = triple_subgrid(notes);

    return notes;
}

/*****************************************************************************
 * ╔═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╗ *
 * ║ 1 2   │ 1   3 │   2 3 │       │       │       │       │       │       ║ *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 ║ *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 ║ *
 * ╚═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╝ *
 * When two numbers are only possible in two fields of a row/column, they    *
 * become the only two numbers that can go in those fields:                  *
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
        // Count occurrences of each note within row
        const cnts: Array<number> = Array(notes.length).fill(0);
        for (let col = 0; col < notes.length; ++col) {
            // Skip empty notes
            if (notes[row][col] == 0) {
                continue;
            }
            for (let n = 0; n < notes.length; ++n) {
                cnts[n] += notes[row][col] & 2 ** n ? 1 : 0;
            }
        }
        
        const triples = generate_triples(cnts);
        // Won't run if no triples have been found:
        for (let i = 0; i < triples.length; ++i) {
            const positions = evaluate_triple_row(notes, triples[i], row);
            // The triple values need to occur in exactly three spots
            // for them to be a triple
            if (positions.filter(x => x).length == 3) {
                notes = isolate_row(notes, row, positions, triples[i][0]);
            }
        }
    }

    return notes;
}

function triple_col(notes: Array<Array<number>>): Array<Array<number>> {
    for (let col = 0; col < notes.length; ++col) {
        // Count occurrences of each note within column
        const cnts: Array<number> = Array(notes.length).fill(0);
        for (let row = 0; row < notes.length; ++row) {
            // Skip empty notes
            if (notes[row][col] == 0) {
                continue;
            }
            for (let n = 0; n < notes.length; ++n) {
                cnts[n] += notes[row][col] & 2 ** n ? 1 : 0;
            }
        }
        
        const triples = generate_triples(cnts);
        // Won't run if no triples have been found:
        for (let i = 0; i < triples.length; ++i) {
            const positions = evaluate_triple_col(notes, triples[i], col);
            // The triple values need to occur in exactly three spots
            // for them to be a triple
            if (positions.filter(x => x).length == 3) {
                notes = isolate_col(notes, col, positions, triples[i][0]);
            }
        }
    }

    return notes;
}

/*****************************************************************************
 * ╔═══════╤═══════╤═══════╗                       ╔═══════╤═══════╤═══════╗ *
 * ║ 1 2   │ 1   3 │       ║                       ║ 1 2   │ 1   3 │       ║ *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║                       ║       │       │ 4 5 6 ║ *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║                       ║       │       │ 7 8 9 ║ *
 * ╟───────┼───────┼───────╢                       ╟───────┼───────┼───────╢ *
 * ║       │   2 3 │       ║                       ║       │ 1 2   │       ║ *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║          ==>          ║ 4 5 6 │       │ 4 5 6 ║ *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║                       ║ 7 8 9 │       │ 7 8 9 ║ *
 * ╟───────┼───────┼───────╢                       ╟───────┼───────┼───────╢ *
 * ║       │       │       ║                       ║       │       │       ║ *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║                       ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║ *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║                       ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║ *
 * ╚═══════╧═══════╧═══════╝                       ╚═══════╧═══════╧═══════╝ *
 *****************************************************************************/

// TODO: Support other grid sizes than 9x9
function triple_subgrid(notes: Array<Array<number>>): Array<Array<number>> {
    const sg_width = 3;
    const sg_height = 3;

    // sg_row/sg_col increase in steps of sg_width/sg_height!
    // Therefore, sg_row/sg_col are not just the indices of the subgrid!
    for (let sg_row = 0; sg_row < notes.length; sg_row += sg_height) {
        for (let sg_col = 0; sg_col < notes.length; sg_col += sg_width) {
            // Count occurrences of each note within column
            const cnts: Array<number> = Array(notes.length).fill(0);
            for (let t = 0; t < notes.length; ++t) {
                const row = sg_row + Math.trunc(t/sg_width);
                const col = sg_col + t % sg_width;
                const note = notes[row][col]
                // Skip empty notes
                if (notes[row][col] == 0) {
                    continue;
                }
                for (let n = 0; n < notes.length; ++n) {
                    cnts[n] += note & 2 ** n ? 1 : 0;
                }
            }

            const triples = generate_triples(cnts);
            // Won't run if no triples have been found:
            for (let i = 0; i < triples.length; ++i) {
                const positions = evaluate_triple_subgrid(notes, triples[i], sg_row, sg_col);
                // The triple values need to occur in exactly three spots
                // for them to be a triple
                if (positions.filter(x => x).length == 3) {
                    notes = isolate_subgrid(notes, sg_row, sg_col, positions, triples[i][0]);
                }
            }
        }
    }

    return notes;
}

// cnts: Number of note occurrences. Index = value of the note
// e.g. [0,3,0,0,1,0,0,0,0] => 1 occurs three times, 4 once.
function generate_triples(cnts: Array<number>): Array<Array<number>> {
    const cands: Array<number> = []; // cands -> candidates

    for (let i = 0; i < cnts.length; ++i) {
        if (cnts[i] == 2 || cnts[i] == 3) {
            cands.push(i);
        }
    }

    // There must be at least three numbers that have two or three note
    // occurrences for there to be a hidden triple
    if (cands.length < 3) {
        return [];
    }

    const triples: Array<Array<number>> = [];

    // Basic combinatorics...
    for (let i = 0; i < cands.length-2; ++i) {
        for (let j = i+1; j < cands.length-1; ++j) {
            for (let k = j+1; k < cands.length; ++k) {
                triples.push([2**cands[i] + 2**cands[j] + 2**cands[k],
                              2**cands[i] + 2**cands[j],
                              2**cands[i] + 2**cands[k],
                              2**cands[j] + 2**cands[k]]);
            }
        }
    }

    return triples;
}

/* notes: 2D array of all notes
 * triple: Triple that shall be evaluated
 * row: Row in which the triple shall be evaluated
**/
function evaluate_triple_row(notes: Array<Array<number>>, triple: Array<number>, row: number): Array<boolean> {
    // positions where formations of the triple occur within the row
    const positions: Array<boolean> = [];

    for (let col = 0; col < notes.length; ++col) {
        const note = notes[row][col];

        if ((note & triple[0]) == triple[0] || (note & triple[1]) == triple[1] ||
            (note & triple[2]) == triple[2] || (note & triple[3]) == triple[3]) {
            positions.push(true);
            continue;
        } else if ((note & triple[0]) == 0) {
            positions.push(false);
        } else {
            // This case is entered whenever the notes of a tile "react" with
            // the triple, but the tile does not contain all notes of the 
            // triple. If that's the case, the proposed triple cannot be a 
            // valid triple. 
            return [];
        }
    }

    return positions;
}

/* notes: 2D array of all notes
 * triple: Triple that shall be evaluated
 * col: Column in which the triple shall be evaluated
**/
function evaluate_triple_col(notes: Array<Array<number>>, triple: Array<number>, col: number): Array<boolean> {
    // positions where formations of the triple occur within the column
    const positions: Array<boolean> = [];

    for (let row = 0; row < notes.length; ++row) {
        const note = notes[row][col];

        if ((note & triple[0]) == triple[0] || (note & triple[1]) == triple[1] ||
            (note & triple[2]) == triple[2] || (note & triple[3]) == triple[3]) {
            positions.push(true);
            continue;
        } else if ((note & triple[0]) == 0) {
            positions.push(false);
        } else {
            // This case is entered whenever the notes of a tile "react" with
            // the triple, but the tile does not contain all notes of the 
            // triple. If that's the case, the proposed triple cannot be a 
            // valid triple. 
            return [];
        }
    }

    return positions;
}

/* notes: 2D array of all notes
 * triple: Triple that shall be evaluated
 * sg_row: Row coordinate of the upper-left corner of the evaluation subgrid
 * sg_col: Column coordinate of the upper-left corner of the evaluation subgrid
**/
function evaluate_triple_subgrid(notes: Array<Array<number>>, triple: Array<number>, sg_row: number, sg_col: number): Array<boolean> {
    const sg_width = 3;
    // positions where formations of the triple occur within the column
    const positions: Array<boolean> = [];

    for (let t = 0; t < notes.length; ++t) {
        const row = sg_row + Math.trunc(t/sg_width);
        const col = sg_col + t % sg_width;

        const note = notes[row][col];

        if ((note & triple[0]) == triple[0] || (note & triple[1]) == triple[1] ||
            (note & triple[2]) == triple[2] || (note & triple[3]) == triple[3]) {
            positions.push(true);
            continue;
        } else if ((note & triple[0]) == 0) {
            positions.push(false);
        } else {
            // This case is entered whenever the notes of a tile "react" with
            // the triple, but the tile does not contain all notes of the 
            // triple. If that's the case, the proposed triple cannot be a 
            // valid triple. 
            return [];
        }
    }

    return positions;
}

/* notes: 2D array of all notes
 * row: Row in which the triple shall be isolated
 * positions: Columns in which members of the triple sit
 * triple: A single note that contains all members of the triple
**/
function isolate_row(notes: Array<Array<number>>, row: number, positions: Array<boolean>, triple: number): Array<Array<number>> {
    for (let col = 0; col < notes.length; ++col) {
        if (positions[col]) {
            notes[row][col] &= triple;
        }
    }

    return notes;
}

/* notes: 2D array of all notes
 * col: Column in which the triple shall be isolated
 * positions: Rows in which members of the triple sit
 * triple: A single note that contains all members of the triple
**/
function isolate_col(notes: Array<Array<number>>, col: number, positions: Array<boolean>, triple: number): Array<Array<number>> {
    for (let row = 0; row < notes.length; ++row) {
        if (positions[row]) {
            notes[row][col] &= triple;
        }
    }

    return notes;
}

/* notes: 2D array of all notes
 * sg_row: Row coordinate of the upper-left corner of the evaluation subgrid
 * sg_col: Column coordinate of the upper-left corner of the evaluation subgrid
 * positions: Rows in which members of the triple sit
 * triple: A single note that contains all members of the triple
**/
function isolate_subgrid(notes: Array<Array<number>>, sg_row: number, sg_col: number, positions: Array<boolean>, triple: number): Array<Array<number>> {
    const sg_width = 3;

    for (let t = 0; t < notes.length; ++t) {
        const row = sg_row + Math.trunc(t/sg_width);
        const col = sg_col + t % sg_width;

        if (positions[t]) {
            notes[row][col] &= triple;
        }
    }

    return notes;
}
