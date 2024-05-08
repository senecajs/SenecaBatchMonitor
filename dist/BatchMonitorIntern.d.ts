import type { TableDef } from './types';
declare function updateTable(tableDef: TableDef, entry: any): TableDef;
declare function rowify(table: any, opts: any): any[][];
export { updateTable, rowify, };
