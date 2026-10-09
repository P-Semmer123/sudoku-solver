import './tile.css'

interface TileProps {
    pos: number,
    val: number,
    note: number,
    activeNum: number,
    impactRow: number,
    impactCol: number,
    row: number,
    col: number,
    gridSize: number,
    ref: (element: HTMLInputElement) => void,
    handleInput: (key: string, row: number, col: number) => void
    handleClick: (row: number, col: number) => void
};

function Tile({pos, val, note, activeNum, impactRow, impactCol, row, col, gridSize, ref, handleInput, handleClick}: TileProps) {
    let className = "tile "

    switch(pos) {
        case 1:
            className += "upper-left";
            break;
        case 2:
            className += "upper";
            break;
        case 3:
            className += "upper-right";
            break;
        case 4:
            className += "left";
            break;
        case 6:
            className += "right";
            break;
        case 7:
            className += "lower-left";
            break;
        case 8:
            className += "lower";
            break;
        case 9:
            className += "lower-right";
            break;
        default:
            className += "center";
    }

    className += val == activeNum ? " highlighted" : "";

    if (row == impactRow && col == impactCol) {
        className += " focused"
    }
    if (row == impactRow && col != impactCol) {
        className += " in-impact";
    } else if (col == impactCol && row != impactRow) {
        className += " in-impact";
    } else if (row != impactRow &&
               Math.trunc(row/3) == Math.trunc(impactRow/3) &&
               Math.trunc(col/3) == Math.trunc(impactCol/3)) {
        className += " in-impact";
    }

    const noteStates: Array<string> = parseNote(note);

    function parseNote(note: number) {
        const noteStates: Array<string> = new Array<string>(9);

        for (let i = 0; i < gridSize; ++i) {
            noteStates[i] = (note & 2**i) ? "active-note" : "inactive-note";
            noteStates[i] += (i+1 == activeNum) ? " highlighted" : "";
        }

        return noteStates;
    }

    return (
        <div className={className}>
            <div className="notes">
                {[...Array(gridSize)].map((_, index) => (
                    <div className = {noteStates[index]} key={index}>{index + 1}</div>
                ))}
            </div>
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