import {
  getColumnLeftOffset,
  getColumnsSize,
  getMaxLevel,
  getNewSorting,
  transformColumns,
} from '../helpers';

const COLUMNS = [
  {
    title: 'Месторождение',
    columns: [
      {
        title: 'Вес общий',
        columns: [
          {
            title: 'Вес, г.',
            accessor: 'weightG',
            align: 'center',
          },
          {
            title: 'Вес, кг.',
            accessor: 'weightKg',
            align: 'center',
          },
        ],
      },
      {
        title: 'Год',
        accessor: 'year',
        align: 'center',
      },
      {
        title: 'Распределение',
        accessor: 'distribution',
        align: 'left',
      },
    ],
  },
  {
    title: 'Отправка',
    accessor: 'dispatch',
    align: 'left',
  },
  {
    title: 'Приход',
    accessor: 'arrival',
    align: 'left',
  },
  {
    title: 'Ответственный',
    columns: [
      {
        title: 'Смена 1',
        accessor: 'responsible1',
        align: 'left',
      },
      {
        title: 'Смена 2',
        accessor: 'responsible2',
        align: 'left',
        sortable: true,
      },
    ],
  },
];

const TRANSFORMED_COLUMNS = [
  [
    {
      title: 'Месторождение',
      columns: [
        {
          title: 'Вес общий',
          columns: [
            { title: 'Вес, г.', accessor: 'weightG', align: 'center' },
            { title: 'Вес, кг.', accessor: 'weightKg', align: 'center' },
          ],
        },
        { title: 'Год', accessor: 'year', align: 'center' },
        { title: 'Распределение', accessor: 'distribution', align: 'left' },
      ],
      position: { colSpan: 4, topHeaderGridIndex: 0, gridIndex: 0, level: 0 },
    },
    {
      title: 'Отправка',
      accessor: 'dispatch',
      align: 'left',
      position: { topHeaderGridIndex: 1, gridIndex: 4, rowSpan: 3, level: 0 },
    },
    {
      title: 'Приход',
      accessor: 'arrival',
      align: 'left',
      position: { topHeaderGridIndex: 2, gridIndex: 5, rowSpan: 3, level: 0 },
    },
    {
      title: 'Ответственный',
      columns: [
        { title: 'Смена 1', accessor: 'responsible1', align: 'left' },
        { title: 'Смена 2', accessor: 'responsible2', align: 'left', sortable: true },
      ],
      position: { colSpan: 2, topHeaderGridIndex: 3, gridIndex: 6, level: 0 },
    },
  ],
  [
    {
      title: 'Вес общий',
      columns: [
        { title: 'Вес, г.', accessor: 'weightG', align: 'center' },
        { title: 'Вес, кг.', accessor: 'weightKg', align: 'center' },
      ],
      position: { colSpan: 2, topHeaderGridIndex: 0, gridIndex: 0, level: 1 },
    },
    {
      title: 'Год',
      accessor: 'year',
      align: 'center',
      position: { topHeaderGridIndex: 0, gridIndex: 2, rowSpan: 2, level: 1 },
    },
    {
      title: 'Распределение',
      accessor: 'distribution',
      align: 'left',
      position: { topHeaderGridIndex: 0, gridIndex: 3, rowSpan: 2, level: 1 },
    },
    {
      title: 'Смена 1',
      accessor: 'responsible1',
      align: 'left',
      position: { topHeaderGridIndex: 3, gridIndex: 4, rowSpan: 2, level: 1 },
    },
    {
      title: 'Смена 2',
      accessor: 'responsible2',
      align: 'left',
      sortable: true,
      position: { topHeaderGridIndex: 3, gridIndex: 5, rowSpan: 2, level: 1 },
    },
  ],
  [
    {
      title: 'Вес, г.',
      accessor: 'weightG',
      align: 'center',
      position: { topHeaderGridIndex: 0, gridIndex: 0, rowSpan: 1, level: 2 },
    },
    {
      title: 'Вес, кг.',
      accessor: 'weightKg',
      align: 'center',
      position: { topHeaderGridIndex: 0, gridIndex: 1, rowSpan: 1, level: 2 },
    },
  ],
];

describe('getColumnsSize', () => {
  it('получение размера колонок', () => {
    const result = getColumnsSize([150, undefined]);

    expect(result).toEqual('150px minmax(min-content, 1fr)');
  });
});

describe('getColumnLeftOffset', () => {
  it('получение отступа слева от колонки, если размеры колонок отсутствуют', () => {
    const result = getColumnLeftOffset({
      columnIndex: 0,
      resizedColumnWidths: [],
      initialColumnWidths: [],
    });

    expect(result).toEqual(0);
  });

  it('получение отступа слева от колонки, если у колонки не изменялся размер', () => {
    const result = getColumnLeftOffset({
      columnIndex: 1,
      resizedColumnWidths: [],
      initialColumnWidths: [100],
    });

    expect(result).toEqual(100);
  });

  it('получение отступа слева от колонки, если у колонки изменялся размер', () => {
    const result = getColumnLeftOffset({
      columnIndex: 1,
      resizedColumnWidths: [200],
      initialColumnWidths: [100],
    });

    expect(result).toEqual(200);
  });

  it('получение отступа слева от колонки, если не у всех колонок до выбранной изменялся размер', () => {
    const result = getColumnLeftOffset({
      columnIndex: 3,
      resizedColumnWidths: [200, undefined, 300],
      initialColumnWidths: [100, 100, 100],
    });

    expect(result).toEqual(600);
  });
});

describe('getNewSorting', () => {
  it('устанавливает сортировку по полю, если не было сортировки', () => {
    expect(getNewSorting(null, 'field')).toEqual({
      by: 'field',
      order: 'asc',
    });
  });

  it('устанавливает сортировку по полю, если было отсортировано по другому полю', () => {
    const result = getNewSorting({ by: 'anotherField', order: 'asc' }, 'field');

    expect(result).toEqual({
      by: 'field',
      order: 'asc',
    });
  });

  it('устанавливает сортировку по убыванию, если было отсортировано по возрастанию', () => {
    const result = getNewSorting({ by: 'field', order: 'asc' }, 'field');

    expect(result).toEqual({
      by: 'field',
      order: 'desc',
    });
  });

  it('убирает сортировку, если было отсортировано по убыванию', () => {
    const result = getNewSorting({ by: 'field', order: 'desc' }, 'field');

    expect(result).toEqual(null);
  });
});

describe('transformColumns', () => {
  it('преобразует исходный массив с любым уровнем вложенности в массив массивов 2 уровня', () => {
    const result = transformColumns(COLUMNS as any, getMaxLevel(COLUMNS as any));

    expect(result).toEqual(TRANSFORMED_COLUMNS);
  });
});
