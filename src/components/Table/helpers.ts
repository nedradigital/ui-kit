import { ColumnWidth, RowField, SortingState, TableColumn, TableRow } from './Table';

export type Position = {
  colSpan?: number;
  rowSpan?: number;
  level: number;
  gridIndex: number;
  topHeaderGridIndex: number;
};

export const getColumnsSize = (sizes: ColumnWidth[]): string => {
  return sizes.map((s) => (s ? `${s}px` : 'minmax(min-content, 1fr)')).join(' ');
};

export const getColumnLeftOffset = ({
  columnIndex,
  resizedColumnWidths,
  initialColumnWidths,
}: {
  columnIndex: number;
  resizedColumnWidths: Array<number | undefined>;
  initialColumnWidths: number[];
}): number => {
  const selectedColumns = initialColumnWidths
    .slice(0, columnIndex)
    .map((size, index) => resizedColumnWidths[index] || size);

  return selectedColumns.reduce((acc, column) => acc + column, 0);
};

export const getNewSorting = <T extends TableRow>(
  currentSorting: SortingState<T>,
  newField: RowField<T>,
): SortingState<T> => {
  if (!currentSorting || currentSorting.by !== newField) {
    return {
      by: newField,
      order: 'asc',
    };
  }

  if (currentSorting.order === 'asc') {
    return {
      by: newField,
      order: 'desc',
    };
  }

  return null;
};

export const getMaxLevel = <T extends TableRow>(columns: Array<TableColumn<T>>) => {
  let count = 0;

  const traverse = (cols: Array<TableColumn<T>>, level = 1) => {
    if (level > count) count = level;
    cols.forEach((item: TableColumn<T>) => {
      if (item.columns) {
        traverse(item.columns, level + 1);
      }
    });
  };

  traverse(columns);

  return count;
};

const getLastChildrenCount = <T extends TableRow>(columns: Array<TableColumn<T>>) => {
  let count = 0;

  const traverse = (cols: Array<TableColumn<T>>) => {
    cols.forEach((item: TableColumn<T>) => {
      if (item.columns) {
        traverse(item.columns);
      } else {
        count++;
      }
    });
  };

  traverse(columns);

  return count;
};

export const transformColumns = <T extends TableRow>(
  columns: Array<TableColumn<T>>,
  maxLevel: number,
): Array<TableColumn<T> & { position: Position }>[] => {
  const stack = [{ columns, index: 0 }];
  const headersArr: Array<TableColumn<T> & { position: Position }>[] = [];

  while (stack.length) {
    const level = stack.length - 1;
    const node = stack[level];
    const item: TableColumn<T> = node.columns[node.index];

    if (item) {
      if (!headersArr[level]) headersArr[level] = [];
      const topHeaderGridIndex = stack[0].index;
      const prevItem = headersArr[level][headersArr[level].length - 1];
      const gridIndex = prevItem
        ? prevItem.position.gridIndex + (prevItem.position.colSpan || 1)
        : 0;

      const handledItem: TableColumn<T> & { position: Position } = {
        ...item,
        position: {
          topHeaderGridIndex,
          gridIndex,
          level,
        },
      };

      if (!handledItem.columns) {
        handledItem.position.rowSpan = maxLevel - level;
        headersArr[level].push(handledItem);
      } else {
        handledItem.position.colSpan = getLastChildrenCount(handledItem.columns);
        headersArr[level].push(handledItem);
        stack.push({ columns: handledItem.columns, index: 0 });
      }
      node.index++;
    } else {
      stack.pop();
    }
  }

  return headersArr;
};
