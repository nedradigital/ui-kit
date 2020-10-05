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
  level = 0,
  colArr: any[] = [],
  thi?: number,
) => {
  columns.forEach((item: TableColumn<T>, i: number) => {
    /* eslint-disable-next-line no-param-reassign */
    if (!colArr[level]) colArr[level] = [];
    const prevItem = colArr[level][colArr[level].length - 1];
    const topHeaderGridIndex = thi ?? i;
    const gridIndex = prevItem
      ? prevItem.position.gridIndex + (prevItem.position.colSpan || 1)
      : 0;

    const handledItem = {
      ...item,
      position: {
        topHeaderGridIndex,
        gridIndex,
        level,
      },
    };

    if (!handledItem.columns) {
      handledItem.position.rowSpan = maxLevel - level;
      colArr[level].push(handledItem);
    } else {
      handledItem.position.colSpan = getLastChildrenCount(handledItem.columns);
      colArr[level].push(handledItem);
      transformColumns(handledItem.columns, maxLevel, level + 1, colArr, topHeaderGridIndex);
    }
  });

  return colArr;
};
