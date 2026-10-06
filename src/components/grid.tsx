import Row from './row'
import './grid.css'
import { useRef, useState } from 'react';
import { set_digit } from '../solver/manage_notes';

interface GridProps {
  gridSize: number
}

function Grid({gridSize}: GridProps) {
  const tileRefs = useRef<HTMLInputElement[][]>([]);
  const [gridData, setGridData] = useState<number[][]>(
    Array.from({length: gridSize}, () => Array(gridSize).fill(0))
  );
  const [noteData, setNoteData] = useState<number[][]>(
    Array.from({length: gridSize}, () => Array(gridSize).fill(511))
  );
  const [editNotes, setEditNotes] = useState<boolean>(false);

  function handleInput(key: string, row: number, col: number) {
    switch(key) {
      case 'ArrowLeft': 
        tileRefs.current[row]?.[(col-1+gridSize)%gridSize]?.focus();
        return;
      case 'ArrowRight': 
        tileRefs.current[row]?.[(col+1)%gridSize]?.focus();
        return;
      case 'ArrowUp':
        tileRefs.current[(row-1+gridSize)%gridSize]?.[col]?.focus();
        return;
      case 'ArrowDown':
        tileRefs.current[(row+1)%gridSize]?.[col]?.focus();
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
      }
    }
    
    if (key == 'Backspace' || key == 'Delete') {
      const newGridData = [...gridData];
      newGridData[row] = [...newGridData[row]];
      newGridData[row][col] = 0;

      setGridData(newGridData);
    }
  }

  return (
    <div className="grid">
      {[...Array(gridSize)].map((_, index) => (
        <Row
          pos={(index%3)+1}
          gridData={gridData[index]}
          noteData={noteData[index]}
          row={index}
          gridSize={gridSize}
          registerTile={(col: number, element: HTMLInputElement) => {
            tileRefs.current[index] ??= [];
            tileRefs.current[index][col] = element;
          }}
          handleInput={handleInput}
        />
      ))}
    </div>
  );
}

export default Grid