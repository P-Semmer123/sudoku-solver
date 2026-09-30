import Tile from './tile'
import './row.css'

function Row({pos, row, registerTile, focusTile}: {pos: number, row: number, registerTile: (col: number, element: HTMLInputElement) => void, focusTile: (key: string, row: number, col: number) => void}) {
  switch(pos) {
    case 1:
      return (
        <div className="row top" data-row={row}>
            <Tile pos={1} row={row} col={0} ref={element => registerTile(0, element)} focusTile={focusTile}/>
            <Tile pos={2} row={row} col={1} ref={element => registerTile(1, element)} focusTile={focusTile}/>
            <Tile pos={3} row={row} col={2} ref={element => registerTile(2, element)} focusTile={focusTile}/>
            <Tile pos={1} row={row} col={3} ref={element => registerTile(3, element)} focusTile={focusTile}/>
            <Tile pos={2} row={row} col={4} ref={element => registerTile(4, element)} focusTile={focusTile}/>
            <Tile pos={3} row={row} col={5} ref={element => registerTile(5, element)} focusTile={focusTile}/>
            <Tile pos={1} row={row} col={6} ref={element => registerTile(6, element)} focusTile={focusTile}/>
            <Tile pos={2} row={row} col={7} ref={element => registerTile(7, element)} focusTile={focusTile}/>
            <Tile pos={3} row={row} col={8} ref={element => registerTile(8, element)} focusTile={focusTile}/>
        </div>
      )
    case 3:
      return (
        <div className="row low" row-no={row}>
            <Tile pos={7} row={row} col={0} ref={element => registerTile(0, element)} focusTile={focusTile}/>
            <Tile pos={8} row={row} col={1} ref={element => registerTile(1, element)} focusTile={focusTile}/>
            <Tile pos={9} row={row} col={2} ref={element => registerTile(2, element)} focusTile={focusTile}/>
            <Tile pos={7} row={row} col={3} ref={element => registerTile(3, element)} focusTile={focusTile}/>
            <Tile pos={8} row={row} col={4} ref={element => registerTile(4, element)} focusTile={focusTile}/>
            <Tile pos={9} row={row} col={5} ref={element => registerTile(5, element)} focusTile={focusTile}/>
            <Tile pos={7} row={row} col={6} ref={element => registerTile(6, element)} focusTile={focusTile}/>
            <Tile pos={8} row={row} col={7} ref={element => registerTile(7, element)} focusTile={focusTile}/>
            <Tile pos={9} row={row} col={8} ref={element => registerTile(8, element)} focusTile={focusTile}/>
        </div>
      )
    default: 
      return (
        <div className="row mid" row-no={row}>
            <Tile pos={4} row={row} col={0} ref={element => registerTile(0, element)} focusTile={focusTile}/>
            <Tile pos={5} row={row} col={1} ref={element => registerTile(1, element)} focusTile={focusTile}/>
            <Tile pos={6} row={row} col={2} ref={element => registerTile(2, element)} focusTile={focusTile}/>
            <Tile pos={4} row={row} col={3} ref={element => registerTile(3, element)} focusTile={focusTile}/>
            <Tile pos={5} row={row} col={4} ref={element => registerTile(4, element)} focusTile={focusTile}/>
            <Tile pos={6} row={row} col={5} ref={element => registerTile(5, element)} focusTile={focusTile}/>
            <Tile pos={4} row={row} col={6} ref={element => registerTile(6, element)} focusTile={focusTile}/>
            <Tile pos={5} row={row} col={7} ref={element => registerTile(7, element)} focusTile={focusTile}/>
            <Tile pos={6} row={row} col={8} ref={element => registerTile(8, element)} focusTile={focusTile}/>
        </div>
      )
  }
}

export default Row