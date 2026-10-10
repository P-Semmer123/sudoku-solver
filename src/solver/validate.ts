export function validate(grid: Array<Array<number>>) {
    return basic_validation(grid) && rule_validation(grid);
}

// TODO: Make this function compatible with non-9x9 grids
export function basic_validation(grid: Array<Array<number>>) {
    // check for null or undefined
    if (grid == null) {
        return false;
    }

    // check for correct dimensions
    if (grid.length != 9) {
        return false;
    }
    for (let i = 0; i < grid.length; ++i) {
        if (grid[i].length != 9) {
            return false;
        }
    }

    //check for correct number values
    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[i].length; ++j){
            if (grid[i][j] < 0 || grid[i][j] > 9 || grid[i][j]%1 != 0)
                return false;
        }
    }
    return true;
}

export function rule_validation(grid: Array<Array<number>>) {
    // check rows for unique values
    for (let i = 0; i < grid.length; ++i) {
        let occurring_values: Array<number> = []
        for (let j = 0; j < grid[i].length; ++j) {
            if (grid[i][j] == 0) {
                continue;
            }
            if (occurring_values.includes(grid[i][j])) {
                return false;
            } else {
                occurring_values = occurring_values.concat(grid[i][j])
            }
        }
    }

    // check columns for unique values
    for (let i = 0; i < grid.length; ++i) {
        let occurring_values: Array<number> = []
        for (let j = 0; j < grid[i].length; ++j) {
            if (grid[j][i] == 0) {
                continue;
            }
            if (occurring_values.includes(grid[j][i])) {
                return false;
            } else {
                occurring_values = occurring_values.concat(grid[j][i])
            }
        }
    }

    // check subgrids for unique values
    for (let subgrid = 0; subgrid < grid.length; ++subgrid) {
        let occurring_values: Array<number> = []
        for (let entry = 0; entry < grid.length; ++entry) {
            const i = Math.trunc(subgrid/3)*3 + Math.trunc(entry/3);
            const j = (subgrid%3)*3 + entry%3;
            if (grid[i][j] == 0) {
                continue;
            }
            if (occurring_values.includes(grid[i][j])) {
                return false;
            } else {
                occurring_values = occurring_values.concat(grid[i][j])
            }
        }
    }

    return true;
}

export function check_solved(grid: Array<Array<number>>): boolean {
    // some basic tests to be sure the input isn't malformed
    if (!basic_validation(grid)) {
        return false;
    }

    const target_sum: number = (grid.length * (grid.length + 1))/2;

    // quickly check rows for correct sum
    for (let i = 0; i < grid.length; ++i) {
        const sum = grid[i].reduce((acc, n) => acc + n, 0);
        if (sum != target_sum) {
            return false;
        }
    }

    // quickly check columns for correct sum
    for (let i = 0; i < grid.length; ++i) {
        const col = grid.map(row => row[i]);
        const sum = col.reduce((acc, n) => acc + n, 0);
        if (sum != target_sum) {
            return false;
        }
    }

    // so far, a 9x9 grid filled entirely with fives would have survived
    // thus, thorough check of rules
    return rule_validation(grid);
}