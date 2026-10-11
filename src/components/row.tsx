import Tile from './tile'
import './row.css'

interface RowProps {
  pos: number, // determines which pos values to give to tiles
  gridData: Array<number>, // grid values
  noteData: Array<number>, // note flags
  activeNum: number, // last typed number
  impactRow: number, // currently focused row
  impactCol: number, // currently focused column
  row: number, // row of this... row
  gridSize: number, // size of the entire grid
  registerTile: (col: number, element: HTMLInputElement) => void,
  handleInput: (key: string, row: number, col: number) => void,
  handleClick: (row: number, col: number) => void,
  solved: boolean // true when sudoku is solved
}

function Row({pos, gridData, noteData, activeNum, impactRow, impactCol, row, gridSize, registerTile, handleInput, handleClick, solved}: RowProps) {
  let className: string = "row"
  let offset: number = -1;

  // turn pos variable into the role the row is supposed to fulfill
  switch(pos) {
    case 1:
      className += " top";
      offset = 1;
      break;
    case 3:
      className += " low";
      offset = 7;
      break;
    default:
      className += " mid";
      offset = 4;
  }

  // return row in the form of a bunch of tile objects
  // and basically hand over a lot of values in the process
  return (
    <div className={className} data-row={row}>
      {[...Array(gridSize)].map((_, index) => (
        <Tile
          pos={(index%3)+offset}
          val={gridData[index]}
          note={noteData[index]}
          activeNum={activeNum}
          impactRow={impactRow}
          impactCol={impactCol}
          row={row}
          col={index}
          gridSize={gridSize}
          ref={element => registerTile(index, element)}
          handleInput={handleInput}
          handleClick={handleClick}
          solved={solved}
        />
      ))}
    </div>
  )
}

export default Row