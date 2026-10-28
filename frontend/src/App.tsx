import './App.css'
import Grid from './components/grid'
import { useRef } from 'react'

function App() {
  const gridRef = useRef<{ genNotes: () => void, trySolve: () => void }>(null)

  return (
    <>
      <div className="gridContainer container">
        <Grid ref={gridRef} gridSize={9}/>
      </div>
      <div className="buttonContainer container">
        <button onClick={() => gridRef.current?.genNotes()}>
          Generate Notes
        </button>
        <span></span>
        <button onClick={() => gridRef.current?.trySolve()}>
          Try to Solve
        </button>
      </div>
    </>
  )
}

export default App
