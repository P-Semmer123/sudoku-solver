import Row from './row'
import './grid.css'
import { useRef } from 'react';

interface GridProps {
  gridSize: number
}

function Grid({gridSize}: GridProps) {
  const tileRefs = useRef<HTMLInputElement[][]>([]);

  function focusTile(key: string, row: number, col: number) {
    if (key === 'ArrowLeft') {
      tileRefs.current[row]?.[(col-1+gridSize)%gridSize]?.focus();
    }
    if (key === 'ArrowRight') {
      tileRefs.current[row]?.[(col+1)%gridSize]?.focus();
    }
    if (key === 'ArrowUp') {
      tileRefs.current[(row-1+gridSize)%gridSize]?.[col]?.focus();
    }
    if (key === 'ArrowDown') {
      tileRefs.current[(row+1)%gridSize]?.[col]?.focus();
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
          focusTile={focusTile}
        />
      ))}
    </div>
  );
}

export default Grid