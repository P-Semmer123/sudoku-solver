import Row from './row'
import './grid.css'
import { useRef } from 'react';

function Grid() {
  const gridSize = 9;
  const tileRefs = useRef<HTMLInputElement[][]>([]);

  function focusTile(key: string, row: number, col: number) {
    console.log(key, row, col);
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