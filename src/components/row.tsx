import Tile from './tile'
import './row.css'

interface RowProps {
  pos: number,
  row: number,
  gridSize: number,
  registerTile: ( col: number, element: HTMLInputElement) => void,
  handleInput: (key: string, row: number, col: number) => void
}

function Row({pos, row, gridSize, registerTile, handleInput}: RowProps) {
  let className: string = "row "
  let offset: number = -1;

  switch(pos) {
    case 1:
      className += "top";
      offset = 1;
      break;
    case 3:
      className += "low";
      offset = 7;
      break;
    default:
      className += "mid";
      offset = 4;
  }

  return (
    <div className={className} data-row={row}>
      {[...Array(gridSize)].map((_, index) => (
        <Tile
          pos={(index%3)+offset}
          row={row}
          col={index}
          ref={element => registerTile(index, element)}
          handleInput={handleInput}
        />
      ))}
    </div>
  )
}

export default Row