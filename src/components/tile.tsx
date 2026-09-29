import './tile.css'

function Tile({pos}: {pos: number}) {
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
        <input className={className}
            onKeyDown={(event) => {
                if (event.currentTarget.value.length == 0 &&
                    /[1-9]/.test(event.key)) {
                    return;
                }
                
                if (event.key == 'Backspace' || event.key == 'Delete') {
                    event.currentTarget.value = '';
                }
                
                event.preventDefault();
            }}
        ></input>
    )
}

export default Tile