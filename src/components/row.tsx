import Tile from './tile'
import './row.css'

interface RowProps {
  pos: number,
  gridData: Array<number>,
  noteData: Array<number>,
  activeNum: number,
  impactRow: number,
  impactCol: number,
  row: number,
  gridSize: number,
  registerTile: ( col: number, element: HTMLInputElement) => void,
  handleInput: (key: string, row: number, col: number) => void,
  handleClick: (row: number, col: number) => void
}

function Row({pos, gridData, noteData, activeNum, impactRow, impactCol, row, gridSize, registerTile, handleInput, handleClick}: RowProps) {
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
        />
      ))}
    </div>
  )
}

export default Row