import { ColumnWidth, RowField, SortingState, TableColumn, TableRow } from './Table';

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
  console.log(selectedColumns);

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
    cols.forEach((item, i) => {
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
    cols.forEach((item, i) => {
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

export const getLastChildrenArray = <T extends TableRow>(columns: Array<TableColumn<T>>) => {
  const array: any = [];

  const traverse = (cols: Array<TableColumn<T>>) => {
    cols.forEach((item, i) => {
      if (item.columns) {
        traverse(item.columns);
      } else {
        array.push(item);
      }
    });
  };

  traverse(columns);

  return array;
};

export const handleColumns = <T extends TableRow>(
  columns: Array<TableColumn<T>>,
  maxLevel: number,
  level = 0,
  colArr: any[] = [],
  tpi?: number,
) => {
  columns.forEach((item, i) => {
    if (!colArr[level]) colArr[level] = [];
    let curLevel = level;
    const topLineIndex = tpi ?? i;
    const prevItem = colArr[level][colArr[level].length - 1];
    const gridIndex = prevItem ? (prevItem.gridIndex + ((prevItem.childrenCount || 1) - 1)) + 1 : 0;

    if (!item.columns) {
      let rowSpan = 1;
      while (curLevel < maxLevel - 1) {
        if (!colArr[curLevel]) colArr[curLevel] = [];
        // colArr[curLevel].push({ title: '' });
        curLevel++;
        rowSpan++;
      }
      if (!colArr[level]) colArr[level] = [];

      colArr[level].push({ ...item, childrenCount: 1, topLineIndex, gridIndex, rowSpan, level });
    } else {

      colArr[curLevel].push({
        ...item,
        columns: null,
        topLineIndex,
        gridIndex,
        level,
        childrenCount: getLastChildrenCount(item.columns),
      });
      handleColumns(item.columns, maxLevel, curLevel + 1, colArr, topLineIndex);
    }
  });

  return colArr;
};
