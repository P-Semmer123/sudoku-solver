import Tile from './tile'
import './row.css'

function Row({pos}: {pos: number}) {
  switch(pos) {
    case 1:
      return (
        <div className="row top">
            <Tile pos={1}/>
            <Tile pos={2}/>
            <Tile pos={3}/>
            <Tile pos={1}/>
            <Tile pos={2}/>
            <Tile pos={3}/>
            <Tile pos={1}/>
            <Tile pos={2}/>
            <Tile pos={3}/>
        </div>
      )
    case 3:
      return (
        <div className="row low">
            <Tile pos={7}/>
            <Tile pos={8}/>
            <Tile pos={9}/>
            <Tile pos={7}/>
            <Tile pos={8}/>
            <Tile pos={9}/>
            <Tile pos={7}/>
            <Tile pos={8}/>
            <Tile pos={9}/>
        </div>
      )
    default: 
      return (
        <div className="row mid">
            <Tile pos={4}/>
            <Tile pos={5}/>
            <Tile pos={6}/>
            <Tile pos={4}/>
            <Tile pos={5}/>
            <Tile pos={6}/>
            <Tile pos={4}/>
            <Tile pos={5}/>
            <Tile pos={6}/>
        </div>
      )
  }

  return (
    <div className="row">
        <Tile pos={1}/>
        <Tile pos={2}/>
        <Tile pos={3}/>
        <Tile pos={1}/>
        <Tile pos={2}/>
        <Tile pos={3}/>
        <Tile pos={1}/>
        <Tile pos={2}/>
        <Tile pos={3}/>
    </div>
  )
}

export default Row