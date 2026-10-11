import './tile.css'

interface TileProps {
    pos: number, // determines which borders need to be thicker
    val: number, // grid value
    note: number, // note flags
    activeNum: number, // last typed number
    impactRow: number, // currently focused row
    impactCol: number, // currently focused column
    row: number, // row of this tile
    col: number, // column of this tile
    gridSize: number, // size of the entire grid
    ref: (element: HTMLInputElement) => void,
    handleInput: (key: string, row: number, col: number) => void,
    handleClick: (row: number, col: number) => void,
    solved: boolean // true when sudoku is solved
};

function Tile({pos, val, note, activeNum, impactRow, impactCol, row, col, gridSize, ref, handleInput, handleClick, solved}: TileProps) {
    let className = "tile"

    // turn pos variable into the role the tile is supposed to fulfill
    switch(pos) {
        case 1:
            className += " upper-left";
            break;
        case 2:
            className += " upper";
            break;
        case 3:
            className += " upper-right";
            break;
        case 4:
            className += " left";
            break;
        case 6:
            className += " right";
            break;
        case 7:
            className += " lower-left";
            break;
        case 8:
            className += " lower";
            break;
        case 9:
            className += " lower-right";
            break;
        default:
            className += " center";
    }

    // highlight tile when it contains the last typed number
    className += val == activeNum ? " highlighted" : "";

    // special highlighting when tile is focused
    if (row == impactRow && col == impactCol) {
        className += " focused"
    }

    // highlight tile when it could be affected by currently focused tile
    if (row == impactRow && col != impactCol) {
        className += " in-impact";
    } else if (col == impactCol && row != impactRow) {
        className += " in-impact";
    } else if (row != impactRow &&
               Math.trunc(row/3) == Math.trunc(impactRow/3) &&
               Math.trunc(col/3) == Math.trunc(impactCol/3)) {
        className += " in-impact";
    }

    // makes the tile play the winning animation
    className += solved ? " solved" : "";

    // determine states of notes for this tile
    const noteStates: Array<string> = parseNote(note);

    function parseNote(note: number) {
        const noteStates: Array<string> = new Array<string>(9);

        for (let i = 0; i < gridSize; ++i) {
            noteStates[i] = (note & 2**i) ? "active-note" : "inactive-note";
            noteStates[i] += (i+1 == activeNum) ? " highlighted" : "";
        }

        return noteStates;
    }

    // TODO: Make everything in the sudoku "markable", i.e. drag over it and
    // copy-paste-able
    return (
        <div className={className}
            // winning animation
            style={{
                "--delay": `${(row + col) * 100}ms`
            } as React.CSSProperties}
        >
            {/*notes*/}
            <div className="notes">
                {[...Array(gridSize)].map((_, index) => (
                    <div className = {noteStates[index]} key={index}>{index + 1}</div>
                ))}
            </div>

            {/*actual input field*/}
            <input
                className="tile-input"
                value={val === 0 ? '' : val}
                data-row={row}
                data-col={col}
                onKeyDown={(event) => {
                    event.preventDefault();
                    handleInput(event.key, row, col);
                }}
                onClick={() => {
                    handleClick(row, col);
                }}
                ref={ref}
            ></input>
        </div>
    )
}

export default Tile