export function last_possibility(oldGrid: Array<Array<number>>, oldNotes: Array<Array<number>>): Array<Array<Array<number>>> {
    let grid = oldGrid.map(r => [...r]);
    let notes = oldNotes.map(r => [...r]);

    [grid, notes] = last_pos_in_tile(grid, notes);
    [grid, notes] = last_pos_in_row(grid, notes);
    [grid, notes] = last_pos_in_col(grid, notes);
    [grid, notes] = last_pos_in_subgrid(grid, notes);
    return [grid, notes];
}

function last_pos_in_tile(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    return [grid, notes];
}

function last_pos_in_row(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    return [grid, notes];
}

function last_pos_in_col(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    return [grid, notes];
}

function last_pos_in_subgrid(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    return [grid, notes];
}