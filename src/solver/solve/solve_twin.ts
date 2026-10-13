export function twins(oldGrid: Array<Array<number>>, oldNotes: Array<Array<number>>): Array<Array<Array<number>>> {
    let grid = oldGrid.map(r => [...r]);
    let notes = oldNotes.map(r => [...r]);

    [grid, notes] = twin_row(grid, notes);
    [grid, notes] = twin_col(grid, notes);
    [grid, notes] = twin_subgrid(grid, notes);
    return [grid, notes];
}

function twin_row(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    return [grid, notes];
}

function twin_col(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    return [grid, notes];
}

function twin_subgrid(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    return [grid, notes];
}
