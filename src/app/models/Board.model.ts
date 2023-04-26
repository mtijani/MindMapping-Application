import { Column } from '../models/Column.model';

export class Board {
    constructor(public name: string, public columns: Column[]) {}
}
