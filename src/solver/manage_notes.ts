export function get_notes(grid: Array<Array<number>>) {
    let notes: Array<Array<number>> = [[511,511,511,511,511,511,511,511,511],
                                       [511,511,511,511,511,511,511,511,511],
                                       [511,511,511,511,511,511,511,511,511],
                                       [511,511,511,511,511,511,511,511,511],
                                       [511,511,511,511,511,511,511,511,511],
                                       [511,511,511,511,511,511,511,511,511],
                                       [511,511,511,511,511,511,511,511,511],
                                       [511,511,511,511,511,511,511,511,511],
                                       [511,511,511,511,511,511,511,511,511]];
    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[0].length; ++j) {
            if (grid[i][j] != 0) {
                [grid, notes] = set_digit(i, j, grid[i][j], grid, notes);
            }
        }
    }
    return notes;
}


// TODO: Decide whether this function checks for the entered digit to be correct,
// i.e. only 1-9 (int) would be allowed.
export function set_digit(row: number, col: number, digit: number, grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    const mask: number = 511 - 2**(digit-1);
    
    const sg_base_row: number = Math.trunc(row/3)*3; // sg = SubGrid
    const sg_base_col: number = Math.trunc(col/3)*3; // sg = SubGrid

    // Set digit and clear notes its field
    grid[row][col] = digit;
    notes[row][col] = 0;

    // Clear all notes for this digit in its subgrid, row and column
    for (let i = 0; i < notes.length; ++i) {
        const tmp_row = sg_base_row + Math.trunc(i/3);
        const tmp_col = sg_base_col + i%3;
        notes[tmp_row][tmp_col] = notes[tmp_row][tmp_col] & mask;

        notes[row][i] = notes[row][i] & mask;
        notes[i][col] = notes[i][col] & mask;
    }

    return [grid, notes];
}