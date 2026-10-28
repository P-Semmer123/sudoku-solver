import Row from './row'
import './grid.css'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { set_digit, get_notes } from '../solver/manage_notes';
import { solve } from '../solver/solve/solve';
import { check_solved } from '../solver/validate';

interface GridProps {
  gridSize: number
}

// needed for useImperativeHandle
interface GridHandle {
  genNotes: () => void,
  trySolve: () => void
}

function Grid({gridSize}: GridProps, ref: React.ForwardedRef<GridHandle>) {
  // references to all tiles
  const tileRefs = useRef<HTMLInputElement[][]>([]);
  // set up grid data
  const [gridData, setGridData] = useState<number[][]>(
    Array.from({length: gridSize}, () => Array(gridSize).fill(0))
  );
  // set up note flags
  const [noteData, setNoteData] = useState<number[][]>(
    Array.from({length: gridSize}, () => Array(gridSize).fill(0))
  );
  // current editing mode
  const [editNotes, setEditNotes] = useState<boolean>(false);
  // win condition reached yes/no
  const [solved, setSolved] = useState<boolean>(false);
  // last typed number
  const [activeNum, setActiveNum] = useState<number>(-1);
  // currently focused row and column
  const [impactRow, setImpactRow] = useState<number>(-1);
  const [impactCol, setImpactCol] = useState<number>(-1);

  // needed for "generate notes" button in App.tsx
  useImperativeHandle(ref, () => ({
    genNotes() {
      setNoteData(get_notes(gridData))
    },
    trySolve() {
      const [newGridData, newNoteData] = solve(gridData)
      setGridData(newGridData)
      setNoteData(newNoteData)
      setSolved(check_solved(newGridData))
    }
  }))

  // called by tile, implements the controls of the game
  function handleInput(key: string, row: number, col: number) {
    // check for movement and mode changes
    switch(key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
        changeFocus(key, row, col);
        return;
      case ' ':
        setEditNotes(!editNotes);
        return;
      default:
        break;
    }

    // handle number inputs
    if (/[1-9]/.test(key)) {
      // sort out function keys, as they also contain numbers
      if (key[0] === 'F') {
        return;
      }

      setActiveNum(Number(key)); // update active number

      // edit data depending on current mode
      if (editNotes) {
        // Prevent note editing when tile already has number in it
        if (gridData[row][col]) {
          return;
        }
        // arrays need to be copied for react to register the change
        const newNoteData = [...noteData];
        newNoteData[row] = [...newNoteData[row]];
        newNoteData[row][col] = noteData[row][col] ^ 2**(Number(key)-1);
        setNoteData(newNoteData);
      } else {
        const [newGridData, newNoteData] = set_digit(row, col, Number(key), gridData, noteData);
        setGridData(newGridData);
        setNoteData(newNoteData);
        // with each new number, win condition is checked
        setSolved(check_solved(newGridData));
      }
    }
    
    // handle deletion of data
    if (key == 'Backspace' || key == 'Delete') {
      // arrays need to be copied for react to register the change
      const newGridData = [...gridData];
      newGridData[row] = [...newGridData[row]];
      newGridData[row][col] = 0;
      setGridData(newGridData);
    }
  }

  // called by tile, handles mouse input
  // mainly needed for updating highlighting also while using the mouse
  function handleClick(row: number, col: number) {
    setActiveNum(gridData[row][col] ? gridData[row][col] : -1);
    setImpactRow(row);
    setImpactCol(col);
  }

  // called in handleInput(), changes focus to intended new tile
  function changeFocus(key: string, row: number, col: number) {
    let newRow = row;
    let newCol = col;

    // determine new focused coordinate implements rollover, i.e. leaving the
    // field left/upper side ports the cursor on the right/bottom side
    switch(key) {
      case 'ArrowLeft':
        // +gridSize needed or else modulo would not work as needed
        newCol = (col-1+gridSize)%gridSize;
        setImpactCol(newCol);
        break;
      case 'ArrowRight':
        newCol = (col+1)%gridSize;
        setImpactCol(newCol);
        break;
      case 'ArrowUp':
        // +gridSize needed or else modulo would not work as needed
        newRow = (row-1+gridSize)%gridSize;
        setImpactRow(newRow);
        break;
      case 'ArrowDown':
        newRow = (row+1)%gridSize;
        setImpactRow(newRow);
        break;
    }
    
    // when field is filled with 0, don't have any active number
    setActiveNum(gridData[newRow][newCol] ? gridData[newRow][newCol] : -1);

    // set focus to new tile
    tileRefs.current[newRow]?.[newCol]?.focus();
    return;
  }

  // return grid in the form of a bunch of row objects
  return (
    <div className="grid">
      {[...Array(gridSize)].map((_, index) => (
        <Row
          pos={(index%3)+1}
          gridData={gridData[index]}
          noteData={noteData[index]}
          activeNum={activeNum}
          impactRow={impactRow}
          impactCol={impactCol}
          row={index}
          gridSize={gridSize}
          registerTile={(col: number, element: HTMLInputElement) => {
            tileRefs.current[index] ??= [];
            tileRefs.current[index][col] = element;
          }}
          handleInput={handleInput}
          handleClick={handleClick}
          solved={solved}
        />
      ))}
    </div>
  );
}

export default forwardRef(Grid)