export function cannons(oldGrid: Array<Array<number>>, oldNotes: Array<Array<number>>): Array<Array<Array<number>>> {
    let grid = oldGrid.map(r => [...r]);
    let notes = oldNotes.map(r => [...r]);

    [grid, notes] = cannon_row(grid, notes);
    [grid, notes] = cannon_col(grid, notes);
    return [grid, notes];
}

function cannon_row(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    return [grid, notes];
}

function cannon_col(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    return [grid, notes];
}