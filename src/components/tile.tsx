import './tile.css'

interface TileProps {
    pos: number,
    val: number,
    note: number,
    activeNum: number,
    row: number,
    col: number,
    gridSize: number,
    ref: (element: HTMLInputElement) => void,
    handleInput: (key: string, row: number, col: number) => void
    handleClick: (row: number, col: number) => void
};

function Tile({pos, val, note, activeNum, row, col, gridSize, ref, handleInput, handleClick}: TileProps) {
    let className = "tile-input "

    switch(pos) {
        case 1:
            className += "upper-left-tile";
            break;
        case 2:
            className += "upper-tile";
            break;
        case 3:
            className += "upper-right-tile";
            break;
        case 4:
            className += "left-tile";
            break;
        case 6:
            className += "right-tile";
            break;
        case 7:
            className += "lower-left-tile";
            break;
        case 8:
            className += "lower-tile";
            break;
        case 9:
            className += "lower-right-tile";
            break;
        default:
            className += "center-tile";
    }

    className += val == activeNum ? " highlighted" : "";

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
        <div className="tile">
            <div className="notes">
                {[...Array(gridSize)].map((_, index) => (
                    <div className = {noteStates[index]} key={index}>{index + 1}</div>
                ))}
            </div>
            <input
                className={className}
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