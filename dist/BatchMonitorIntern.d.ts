import type { Table } from './types';
declare function updateTable(tableDef: Table, entry: any): Table;
declare function rowify(table: Table, opts: any): string[][];
export { updateTable, rowify, };
