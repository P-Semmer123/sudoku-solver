import {cannons} from './solve_cannon';
import {onlys} from './solve_only';
import {twins} from './solve_twin';
import {last_possibility} from './solve_last_pos';
import {get_notes} from '../manage_notes';
import { check_solved } from '../validate';

// TODO: Add input sanitation.
export function solve(oldGrid: Array<Array<number>>): Array<Array<Array<number>>> {
    const max_iter = 30;
    let grid = oldGrid.map(r => [...r]);
    let notes = get_notes(grid);

    let iter_cnt = 0;

    while(!check_solved(grid) && iter_cnt < max_iter) {
        notes = cannons(notes);
        notes = onlys(notes);
        [grid, notes] = twins(grid, notes);
        //TODO: [grid, notes] = triplets(grid, notes);
        [grid, notes] = last_possibility(grid, notes);
        iter_cnt += 1;
    }

    return [grid, notes];
}
