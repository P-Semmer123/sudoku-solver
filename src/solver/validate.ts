export function validate(grid: Array<Array<number>>) {
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