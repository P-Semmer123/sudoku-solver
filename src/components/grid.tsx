import Row from './row'
import './grid.css'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { set_digit, get_notes } from '../solver/manage_notes';
import { check_solved } from '../solver/validate';

interface GridProps {
  gridSize: number
}

interface GridHandle {
  genNotes: () => void
}

function Grid({gridSize}: GridProps, ref: React.ForwardedRef<GridHandle>) {
  const tileRefs = useRef<HTMLInputElement[][]>([]);
  const [gridData, setGridData] = useState<number[][]>(
    Array.from({length: gridSize}, () => Array(gridSize).fill(0))
  );
  const [noteData, setNoteData] = useState<number[][]>(
    Array.from({length: gridSize}, () => Array(gridSize).fill(0))
  );
  const [editNotes, setEditNotes] = useState<boolean>(false);
  const [solved, setSolved] = useState<boolean>(false);
  const [activeNum, setActiveNum] = useState<number>(-1);
  const [impactRow, setImpactRow] = useState<number>(-1);
  const [impactCol, setImpactCol] = useState<number>(-1);

  useImperativeHandle(ref, () => ({
    genNotes() {
      setNoteData(get_notes(gridData))
    }
  }))

  function handleInput(key: string, row: number, col: number) {
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

    if (/[1-9]/.test(key)) {
      // Sort out F-keys
      if (key[0] === 'F') {
        return;
      }
      setActiveNum(Number(key));
      if (editNotes) {
        // Prevent note editing when tile already has number in it
        if (gridData[row][col]) {
          return;
        }
        const newNoteData = [...noteData];
        newNoteData[row] = [...newNoteData[row]];
        newNoteData[row][col] = noteData[row][col] ^ 2**(Number(key)-1);
        setNoteData(newNoteData);
      } else {
        const [newGridData, newNoteData] = set_digit(row, col, Number(key), gridData, noteData);
        setGridData(newGridData);
        setNoteData(newNoteData);
        setSolved(check_solved(newGridData));
      }
    }
    
    if (key == 'Backspace' || key == 'Delete') {
      const newGridData = [...gridData];
      newGridData[row] = [...newGridData[row]];
      newGridData[row][col] = 0;

      setGridData(newGridData);
    }
  }

  function handleClick(row: number, col: number) {
    setActiveNum(gridData[row][col] ? gridData[row][col] : -1);
    setImpactRow(row);
    setImpactCol(col);
  }

  function changeFocus(key: string, row: number, col: number) {
    let newRow = row;
    let newCol = col;

    switch(key) {
      case 'ArrowLeft':
        newCol = (col-1+gridSize)%gridSize;
        setImpactCol(newCol);
        break;
      case 'ArrowRight':
        newCol = (col+1)%gridSize;
        setImpactCol(newCol);
        break;
      case 'ArrowUp':
        newRow = (row-1+gridSize)%gridSize;
        setImpactRow(newRow);
        break;
      case 'ArrowDown':
        newRow = (row+1)%gridSize;
        setImpactRow(newRow);
        break;
    }
    
    setActiveNum(gridData[newRow][newCol] ? gridData[newRow][newCol] : -1);

    tileRefs.current[newRow]?.[newCol]?.focus();
    return;
  }

  let className: string = "grid";
  className += solved ? " solved" : "";

  return (
    <div className={className}>
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