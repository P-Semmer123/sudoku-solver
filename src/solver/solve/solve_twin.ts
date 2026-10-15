// TODO: Generalize for triplets, etc.
export function twins(oldNotes: Array<Array<number>>): Array<Array<number>> {
    let notes = oldNotes.map(r => [...r]);

    notes = twin_row(notes);
    notes = twin_col(notes);
    notes = twin_subgrid(notes);
    
    return notes;
}

/*****************************************************************************
 * ╔═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╗ *
 * ║ 1 2 3 │ 1 2 3 │     3 │     3 │     3 │     3 │     3 │     3 │     3 ║ *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 ║ *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 ║ *
 * ╚═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╝ *
 * When two numbers are only possible in two fields of a row/column, they    *
 * become the only two numbers that can go in those tiles:                   *
 * ╔═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╤═══════╗ *
 * ║ 1 2   │ 1 2   │     3 │     3 │     3 │     3 │     3 │     3 │     3 ║ *
 * ║       │       │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 │ 4 5 6 ║ *
 * ║       │       │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 │ 7 8 9 ║ *
 * ╚═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╧═══════╝ *
 *****************************************************************************/

// TODO: Support other grid sizes than 9x9
function twin_row(notes: Array<Array<number>>): Array<Array<number>> {
    for (let row = 0; row < notes.length; ++row) {
        for (let n = 0; n < notes.length; ++n) {
            let pos1 = -1;
            let pos2 = -1;
            for (let col = 0; col < notes.length; ++col) {
                // Find a row where a note for n is set exactly two times.
                if (notes[row][col] & 2 ** n) {
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
            if (pos2 != -1) {
                notes = find_2nd_twin_row(notes, row, pos1, pos2, n);
            }
        }
    }
    return notes;
}

// TODO: Support other grid sizes than 9x9
function twin_col(notes: Array<Array<number>>): Array<Array<number>> {
    for (let col = 0; col < notes.length; ++col) {
        for (let n = 0; n < notes.length; ++n) {
            let pos1 = -1;
            let pos2 = -1;
            for (let row = 0; row < notes.length; ++row) {
                // Find a column where a note for n is set exactly two times.
                if (notes[row][col] & 2 ** n) {
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
            if (pos2 != -1) {
                notes = find_2nd_twin_col(notes, pos1, pos2, col, n);
            }
        }
    }
    return notes;
}

/*****************************************************************************
 * ╔═══════╤═══════╤═══════╗                       ╔═══════╤═══════╤═══════╗ *
 * ║ 1 2 3 │     3 │     3 ║                       ║ 1 2   │     3 │     3 ║ *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║                       ║       │ 4 5 6 │ 4 5 6 ║ *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║                       ║       │ 7 8 9 │ 7 8 9 ║ *
 * ╟───────┼───────┼───────╢                       ╟───────┼───────┼───────╢ *
 * ║     3 │ 1 2 3 │     3 ║                       ║     3 │ 1 2   │     3 ║ *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║          ==>          ║ 4 5 6 │       │ 4 5 6 ║ *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║                       ║ 7 8 9 │       │ 7 8 9 ║ *
 * ╟───────┼───────┼───────╢                       ╟───────┼───────┼───────╢ *
 * ║     3 │     3 │     3 ║                       ║     3 │     3 │     3 ║ *
 * ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║                       ║ 4 5 6 │ 4 5 6 │ 4 5 6 ║ *
 * ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║                       ║ 7 8 9 │ 7 8 9 │ 7 8 9 ║ *
 * ╚═══════╧═══════╧═══════╝                       ╚═══════╧═══════╧═══════╝ *
 * If there's only one remaining note in a tile,                             *
 * "promote" that noted number to be the number in the grid.                 *
 *****************************************************************************/

// TODO: Support other grid sizes than 9x9
function twin_subgrid(notes: Array<Array<number>>): Array<Array<number>> {
    const sg_width = 3;
    const sg_height = 3;

    // sg_row/sg_col increase in steps of sg_width/sg_height!
    // Therefore, sg_row/sg_col are not just the indices of the subgrid!
    for (let sg_row = 0; sg_row < notes.length; sg_row += sg_height) {
        for (let sg_col = 0; sg_col < notes.length; sg_col += sg_width) {
            for (let n = 0; n < notes.length; ++n) {
                let pos1 = -1;
                let pos2 = -1;
                for (let t = 0; t < notes.length; ++t) {
                    const row = sg_row + Math.trunc(t/sg_width);
                    const col = sg_col + t % sg_width;
                    // Find a subgrid where a note for n is set exactly two times.
                    if (notes[row][col] & 2 ** n) {
                        if (pos1 == -1) {
                            pos1 = t;
                            continue;
                        }
                        if (pos2 == -1) {
                            pos2 = t;
                            continue;
                        } else {
                            pos2 = -1;
                            break;
                        }
                    }
                }
                if (pos2 != -1) {
                    notes = find_2nd_twin_sg(notes, sg_row, sg_col, pos1, pos2, n);
                }
            }
        }
    }
    return notes;
}

/* notes: 2D array of all notes
 * row: Row to be searched for second twin
 * pos1: First column where n is set
 * pos2: Second column where n is set
 * n: Number that is suspected to have a twin
**/
function find_2nd_twin_row(notes: Array<Array<number>>, row: number, pos1: number, pos2: number, n: number): Array<Array<number>> {
    let twin = -1;

    // pot_twin: potential twin
    for (let pot_twin = 0; pot_twin < notes.length; ++pot_twin) {
        // We are searching for a twin OF n, so we have to skip n itself.
        if (pot_twin == n) {
            continue;
        }

        // A twin, of course, has to have set notes in the same two tiles
        if ((notes[row][pos1] & 2 ** pot_twin) &&
            (notes[row][pos2] & 2 ** pot_twin)) {
            
            // Furthermore, those notes shall be set ONLY in those two tiles
            let cnt = 0;
            for (let col = 0; col < notes.length; ++col) {
                // Exclude twin locations
                if (col == pos1 || col == pos2) {
                    continue;
                }
                
                // Check for note
                if (notes[row][col] & 2 ** pot_twin) {
                    ++cnt;
                    break;
                }
            }

            // Note has only been set in those two other tiles, so the
            // potential twin must be a real twin.
            if (cnt == 0) {
                twin = pot_twin;
            }
        }
    }

    // Since those two numbers can only be placed in those two tiles within a
    // row, we can set the notes of said tiles to only those two numbers.
    if (twin != -1) {
        notes[row][pos1] = 2 ** n + 2 ** twin;
        notes[row][pos2] = 2 ** n + 2 ** twin;
    }

    return notes;
}

/* notes: 2D array of all notes
 * pos1: First row where n is set
 * pos2: Second row where n is set
 * col: Column to be searched for second twin
 * n: Number that is suspected to have a twin
**/
function find_2nd_twin_col(notes: Array<Array<number>>, pos1: number, pos2: number, col: number, n: number): Array<Array<number>> {
    let twin = -1;

    // pot_twin: potential twin
    for (let pot_twin = 0; pot_twin < notes.length; ++pot_twin) {
        // We are searching for a twin OF n, so we have to skip n itself.
        if (pot_twin == n) {
            continue;
        }

        // A twin, of course, has to have set notes in the same two tiles
        if ((notes[pos1][col] & 2 ** pot_twin) &&
            (notes[pos2][col] & 2 ** pot_twin)) {
            
            // Furthermore, those notes shall be set ONLY in those two tiles
            let cnt = 0;
            for (let row = 0; row < notes.length; ++row) {
                // Exclude twin locations
                if (row == pos1 || row == pos2) {
                    continue;
                }
                
                // Check for note
                if (notes[row][col] & 2 ** pot_twin) {
                    ++cnt;
                    break;
                }
            }

            // Note has only been set in those two other tiles, so the
            // potential twin must be a real twin.
            if (cnt == 0) {
                twin = pot_twin;
            }
        }
    }

    // Since those two numbers can only be placed in those two tiles within a
    // column, we can set the notes of said tiles to only those two numbers.
    if (twin != -1) {
        notes[pos1][col] = 2 ** n + 2 ** twin;
        notes[pos2][col] = 2 ** n + 2 ** twin;
    }

    return notes;
}

/* notes: 2D array of all notes
 * sg_row: Row coordinate of the upper-left corner of the searched subgrid
 * sg_col: Column coordinate of the upper-left corner of the searched subgrid
 * pos1: In-subgrid position* for the first tile where n is set
 * pos2: In-subgrid position* for the first tile where n is set
 * n: Number that is suspected to have a twin
 * 
 * *In-subgrid position:   ╔═══╤═══╤═══╗
 *                         ║ 1 │ 2 │ 3 ║
 *                         ╟───┼───┼───╢
 *                         ║ 4 │ 5 │ 6 ║
 *                         ╟───┼───┼───╢
 *                         ║ 7 │ 8 │ 9 ║
 *                         ╚═══╧═══╧═══╝
**/
function find_2nd_twin_sg(notes: Array<Array<number>>, sg_row: number, sg_col: number, pos1: number, pos2: number, n: number): Array<Array<number>>{
    const sg_width = 3;
    
    const row1 = sg_row + Math.trunc(pos1/sg_width);
    const row2 = sg_row + Math.trunc(pos2/sg_width);
    const col1 = sg_col + pos1 % sg_width;
    const col2 = sg_col + pos2 % sg_width;

    let twin = -1;

    // pot_twin: potential twin
    for (let pot_twin = 0; pot_twin < notes.length; ++pot_twin) {
        // We are searching for a twin OF n, so we have to skip n itself.
        if (pot_twin == n) {
            continue;
        }

        // A twin, of course, has to have set notes in the same two tiles
        if ((notes[row1][col1] & 2 ** pot_twin) &&
            (notes[row2][col2] & 2 ** pot_twin)) {
            
            // Furthermore, those notes shall be set ONLY in those two tiles
            let cnt = 0;
            for (let t = 0; t < notes.length; ++t) {
                // Exclude twin locations
                if (t == pos1 || t == pos2) {
                    continue;
                }
                
                // Calculate current coordinate and check for note
                const row = sg_row + Math.trunc(t/sg_width);
                const col = sg_col + t % sg_width;
                if (notes[row][col] & 2 ** pot_twin) {
                    ++cnt;
                    break;
                }
            }

            // Note has only been set in those two other tiles, so the
            // potential twin must be a real twin.
            if (cnt == 0) {
                twin = pot_twin;
            }
        }
    }

    // Since those two numbers can only be placed in those two tiles within a
    // subgrid, we can set the notes of said tiles to only those two numbers.
    if (twin != -1) {
        notes[row1][col1] = 2 ** n + 2 ** twin;
        notes[row2][col2] = 2 ** n + 2 ** twin;
    }

    return notes;
}