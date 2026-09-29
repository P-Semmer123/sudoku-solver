import Row from './row'
import './grid.css'

function Grid() {

  return (
    <div className="grid">
        <Row pos={1}/>
        <Row pos={2}/>
        <Row pos={3}/>
        <Row pos={1}/>
        <Row pos={2}/>
        <Row pos={3}/>
        <Row pos={1}/>
        <Row pos={2}/>
        <Row pos={3}/>
    </div>
  )
}

export default Grid