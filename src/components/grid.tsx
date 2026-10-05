import Row from './row'
import './grid.css'
import { useRef } from 'react';

interface GridProps {
  gridSize: number
}

function Grid({gridSize}: GridProps) {
  const tileRefs = useRef<HTMLInputElement[][]>([]);

  function handleInput(key: string, row: number, col: number) {
    switch(key) {
      case 'ArrowLeft': 
        tileRefs.current[row]?.[(col-1+gridSize)%gridSize]?.focus();
        break;
      case 'ArrowRight': 
        tileRefs.current[row]?.[(col+1)%gridSize]?.focus();
        break;
      case 'ArrowUp':
        tileRefs.current[(row-1+gridSize)%gridSize]?.[col]?.focus();
        break;
      case 'ArrowDown':
        tileRefs.current[(row+1)%gridSize]?.[col]?.focus();
        break;
      default:
        break;
    }
  }

  return (
    <div className="grid">
      {[...Array(gridSize)].map((_, index) => (
        <Row
          pos={(index%3)+1}
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