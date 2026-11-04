import { Link } from "react-router";
import { useRef } from 'react'
import Grid from '../components/grid'
import HelloButton from '../components/helloButton'

function SudokuSolverPage() {
    const gridRef = useRef<{ genNotes: () => void, trySolve: () => void }>(null)

    return (
        <>
            <div>
                <Link to="/register">
                    Register
                </Link>
            </div>
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
                <HelloButton />
            </div>
        </>
    )
}

export default SudokuSolverPage