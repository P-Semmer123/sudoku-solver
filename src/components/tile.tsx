import './tile.css'

function Tile({pos, row, col, ref, focusTile}: {pos: number, row: number, col: number, ref: (element: HTMLInputElement) => void, focusTile: (key: string, row: number, col: number) => void}) {
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

    return (
        <input className={className} data-row={row} data-col={col}
            onKeyDown={(event) => {
                if (event.currentTarget.value.length == 0 &&
                    /[1-9]/.test(event.key)) {
                    return;
                }

                event.preventDefault();

                if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    focusTile(event.key, row, col);
                }
                
                if (event.key == 'Backspace' || event.key == 'Delete') {
                    event.currentTarget.value = '';
                }
            }}
            ref={ref}
        ></input>
    )
}

export default Tile