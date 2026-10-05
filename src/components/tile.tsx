import './tile.css'

interface TileProps {
    pos: number,
    row: number,
    col: number,
    ref: (element: HTMLInputElement) => void,
    handleInput: (key: string, row: number, col: number) => void
};

function Tile({pos, row, col, ref, handleInput}: TileProps) {
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

    return (
        <div className="tile">
            <div className="notes">
                {[...Array(9)].map((_, index) => (
                    <div key={index}>{index + 1}</div>
                ))}
            </div>
            <input className={className} data-row={row} data-col={col}
                onKeyDown={(event) => {
                    event.preventDefault();
                    if (/[1-9]/.test(event.key)) {
                        event.currentTarget.value = event.key;
                    }

                    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' ||
                        event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                        handleInput(event.key, row, col);
                    }
                    
                    if (event.key == 'Backspace' || event.key == 'Delete') {
                        event.currentTarget.value = '';
                    }
                }}
                ref={ref}
            ></input>
        </div>
    )
}

export default Tile