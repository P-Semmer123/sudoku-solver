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
        <Row pos={1} row={0} registerTile={(col: number, element: HTMLInputElement) => {
          tileRefs.current[0] ??= [];
          tileRefs.current[0][col] = element;
        }}
        focusTile={focusTile}/>
        <Row pos={2} row={1} registerTile={(col: number, element: HTMLInputElement) => {
          tileRefs.current[1] ??= [];
          tileRefs.current[1][col] = element;
        }}
        focusTile={focusTile}/>
        <Row pos={3} row={2} registerTile={(col: number, element: HTMLInputElement) => {
          tileRefs.current[2] ??= [];
          tileRefs.current[2][col] = element;
        }}
        focusTile={focusTile}/>
        <Row pos={1} row={3} registerTile={(col: number, element: HTMLInputElement) => {
          tileRefs.current[3] ??= [];
          tileRefs.current[3][col] = element;
        }}
        focusTile={focusTile}/>
        <Row pos={2} row={4} registerTile={(col: number, element: HTMLInputElement) => {
          tileRefs.current[4] ??= [];
          tileRefs.current[4][col] = element;
        }}
        focusTile={focusTile}/>
        <Row pos={3} row={5} registerTile={(col: number, element: HTMLInputElement) => {
          tileRefs.current[5] ??= [];
          tileRefs.current[5][col] = element;
        }}
        focusTile={focusTile}/>
        <Row pos={1} row={6} registerTile={(col: number, element: HTMLInputElement) => {
          tileRefs.current[6] ??= [];
          tileRefs.current[6][col] = element;
        }}
        focusTile={focusTile}/>
        <Row pos={2} row={7} registerTile={(col: number, element: HTMLInputElement) => {
          tileRefs.current[7] ??= [];
          tileRefs.current[7][col] = element;
        }}
        focusTile={focusTile}/>
        <Row pos={3} row={8} registerTile={(col: number, element: HTMLInputElement) => {
          tileRefs.current[8] ??= [];
          tileRefs.current[8][col] = element;
        }}
        focusTile={focusTile}/>
    </div>
  )
}

export default Grid