export function onlys(oldGrid: Array<Array<number>>, oldNotes: Array<Array<number>>): Array<Array<Array<number>>> {
    let grid = oldGrid.map(r => [...r]);
    let notes = oldNotes.map(r => [...r]);

    [grid, notes] = only_row(grid, notes);
    [grid, notes] = only_col(grid, notes);
    return [grid, notes];
}

function only_row(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    return [grid, notes];
}

function only_col(grid: Array<Array<number>>, notes: Array<Array<number>>): Array<Array<Array<number>>> {
    return [grid, notes];
}
