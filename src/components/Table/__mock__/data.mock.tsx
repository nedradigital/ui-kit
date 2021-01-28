import React from 'react';

import { isDefined } from '../../../utils/type-guards';
import { Badge } from '../../Badge/Badge';
import { TableCheckboxGroupFilter } from '../CheckboxGroupFilter/TableCheckboxGroupFilter';
import { TableRangeFilter } from '../RangeFilter/TableRangeFilter';
import { Props as TableProps, TableFilters as Filters, TableRow } from '../Table';

export const rows = [
  {
    id: 'row1',
    field: 'Приобское',
    year: 1982,
    type: 'Нефтяное',
    estimatedReserves: 5000,
    remainingReserves: 1700,
    production: 33,
    total: 313,
  },
  {
    id: 'row2',
    field: 'Уренгойское газонефтеконденсат­ное',
    year: 2001,
    type: 'Конденсатное',
    estimatedReserves: 7540,
    remainingReserves: 7540,
    production: 363,
    total: 88,
  },
  {
    id: 'row3',
    field: 'Красноленинская группа',
    year: 1985,
    type: 'Комбинированное',
    estimatedReserves: 8766,
    remainingReserves: 3374,
    production: 256,
    total: 434,
  },
  {
    id: 'row4',
    field: 'Великое',
    year: 1989,
    type: 'Конденсатное',
    estimatedReserves: 1697,
    remainingReserves: 4818,
    production: 250,
    total: 236,
  },
  {
    id: 'row5',
    field: 'Русское газонефтяное',
    year: 1997,
    type: 'Нефтяное',
    estimatedReserves: 5169,
    remainingReserves: 3712,
    production: 292,
    total: 417,
  },
];

export const rangeFilterer = (
  value: number | string,
  filterValue: { min: number | string; max: number | string },
): boolean => {
  const minValue = isDefined(filterValue.min) ? filterValue.min : -Infinity;
  const maxValue = isDefined(filterValue.max) ? filterValue.max : Infinity;

  return Number(value) <= Number(maxValue) && Number(value) >= Number(minValue);
};

export const filters: Filters<TableRow> = {
  year: {
    id: 'yearFilter',
    filterer: rangeFilterer,
    field: 'year',
    filterComponent: TableRangeFilter,
  },
  field: {
    id: 'fieldFilter',
    filterer: (value: string, filterValue: Array<{ name: string; value: string }>): boolean => {
      return filterValue.some(({ name }) => name === value);
    },
    field: 'field',
    filterComponent: TableCheckboxGroupFilter,
    filterComponentProps: {
      items: [
        { name: 'Нефтяное', value: 'oil' },
        { name: 'Конденсатное', value: 'condensated' },
        { name: 'Комбинированное', value: 'combined' },
        { name: 'Приобское', value: 'priobskoye' },
        { name: 'Уренгойское газонефтеконденсат­ное', value: 'urengoyskoye' },
        { name: 'Красноленинская группа', value: 'krasnoleninskaya' },
        { name: 'Великое', value: 'velikoye' },
        { name: 'Русское газонефтяное', value: 'rusGasoil' },
      ],
      title: 'Выбрать месторождение',
    },
  },
  estimatedReserves: {
    id: 'estimatedReservesFilter',
    filterer: rangeFilterer,
    field: 'estimatedReserves',
    filterComponent: TableRangeFilter,
  },

  remainingReserves: {
    id: 'remainingReservesFilter',
    filterer: rangeFilterer,
    field: 'remainingReserves',
    filterComponent: TableRangeFilter,
  },

  production: {
    id: 'productionFilter',
    filterer: rangeFilterer,
    field: 'production',
    filterComponent: TableRangeFilter,
  },

  total: {
    id: 'totalFilter',
    filterer: rangeFilterer,
    field: 'total',
    filterComponent: TableRangeFilter,
    filterComponentProps: { title: 'Всего добыто' },
  },
};

export const tableData: TableProps<{ id: string; [key: string]: any }> = {
  columns: [
    {
      title: 'Месторождение',
      accessor: 'field',
      align: 'left',
      sortable: true,
    },
    {
      title: 'Год открытия',
      accessor: 'year',
      align: 'center',
      sortable: true,
    },
    {
      title: 'Тип',
      accessor: 'type',
      align: 'center',
    },
    {
      title: 'Предполагаемые полные \nзапасы, млн.т.',
      accessor: 'estimatedReserves',
      align: 'right',
      sortable: true,
    },
    {
      title: 'Остаточные извлекаемые \nзапасы, млн.т.',
      accessor: 'remainingReserves',
      align: 'right',
      sortable: true,
    },
    {
      title: 'Добыча тыс.т/сут.',
      accessor: 'production',
      align: 'right',
      sortable: true,
    },
    {
      title: 'Всего добыто, млн.т.',
      accessor: 'total',
      align: 'right',
      sortable: true,
    },
  ],
  rows,
  filters,
};

const rowsForMultiLevelHeadersData = [
  {
    id: 'row1',
    weightG: '1.398',
    weightKg: '~ 0',
    year: 2007,
    distribution: 'Отсутствует',
    dispatch: '12.09.2020',
    arrival: '18.09.2020',
    responsible1: 'Иванов И.И.',
    responsible2: 'Сидоров И.И.',
  },
  {
    id: 'row2',
    weightG: '2.398',
    weightKg: '~ 0',
    year: 2017,
    distribution: 'В процессе',
    dispatch: '1.09.2020',
    arrival: '8.09.2020',
    responsible1: 'Иванов П.П.',
    responsible2: 'Петров П.П.',
  },
  {
    id: 'row3',
    weightG: '3.398',
    weightKg: '~ 0',
    year: 2020,
    distribution: 'В процессе',
    dispatch: '11.09.2020',
    arrival: '28.10.2020',
    responsible1: 'Сидоров С.С.',
    responsible2: 'Иванов С.С.',
  },
  {
    id: 'row4',
    weightG: '4.398',
    weightKg: 'до 10',
    year: 2010,
    distribution: 'Есть',
    dispatch: '9.09.2020',
    arrival: '13.09.2020',
    responsible1: 'Петров И.И.',
    responsible2: 'Иванов И.И.',
  },
  {
    id: 'row5',
    weightG: '1.398',
    weightKg: '~ 0',
    year: 2007,
    distribution: 'Отсутствует',
    dispatch: '12.09.2020',
    arrival: '18.09.2020',
    responsible1: 'Петров И.И.',
    responsible2: 'Сидоров И.И.',
  },
  {
    id: 'row6',
    weightG: '2.398',
    weightKg: '~ 0',
    year: 2017,
    distribution: 'В процессе',
    dispatch: '1.09.2020',
    arrival: '8.09.2020',
    responsible1: 'Петров И.И.',
    responsible2: 'Петров П.П.',
  },
  {
    id: 'row7',
    weightG: '3.398',
    weightKg: 'до 1',
    year: 2020,
    distribution: 'В процессе',
    dispatch: '11.09.2020',
    arrival: '28.10.2020',
    responsible1: 'Сидоров С.С.',
    responsible2: 'Иванов С.С.',
  },
  {
    id: 'row8',
    weightG: '4.398',
    weightKg: 'до 10',
    year: 2010,
    distribution: 'Есть',
    dispatch: '9.09.2020',
    arrival: '13.09.2020',
    responsible1: 'Петров И.И.',
    responsible2: 'Иванов И.И.',
  },
];

export const tableWithMultiLevelHeadersData = {
  columns: [
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
  ],
  rows: rowsForMultiLevelHeadersData,
};

const badgeParams: React.ComponentProps<typeof Badge> = {
  view: 'filled',
  minified: true,
  size: 'm',
};

const tableWithTrafficLightDataRows: TableRow[] = [
  {
    id: 'row1',
    field: 'Северный бур',
    sum: 20,
    status: <Badge {...badgeParams} status="normal" />,
    statusOrder: 1,
  },
  {
    id: 'row2',
    field: 'Южное месторождение',
    sum: 15,
    status: <Badge {...badgeParams} status="warning" />,
    statusOrder: 2,
  },
  {
    id: 'row3',
    field: 'Западный разлом',
    sum: 7,
    status: <Badge {...badgeParams} status="error" />,
    statusOrder: 3,
  },
  {
    id: 'row4',
    field: 'Восточный разлом',
    sum: 1,
    status: <Badge {...badgeParams} status="normal" />,
    statusOrder: 1,
  },
];

export const tableWithBagdeData: TableProps<typeof tableWithTrafficLightDataRows[number]> = {
  columns: [
    {
      title: 'Локация',
      accessor: 'field',
      align: 'left',
      sortable: true,
    },
    {
      title: 'Сумма скважин без МГРП',
      accessor: 'sum',
      align: 'right',
      sortable: true,
    },
    {
      title: 'Статус',
      accessor: 'status',
      align: 'center',
      sortable: true,
      sortByField: 'statusOrder',
    },
  ],
  rows: tableWithTrafficLightDataRows,
  filters: {
    field: {
      field: 'field',
      id: 'fieldFilter',
      filterer: (value: string, filterValue: Array<{ name: string; value: string }>): boolean => {
        return filterValue.some(({ name }) => name === value);
      },
      filterComponent: TableCheckboxGroupFilter,
      filterComponentProps: {
        withSearch: true,
        items: [
          { name: 'Северный бур', value: 'fieldNorthDrill' },
          { name: 'Южное месторождение', value: 'fieldSouthWell' },
          { name: 'Западный разлом', value: 'fieldWestCrack' },
        ],
      },
    },
    sum: {
      field: 'sum',
      id: 'sumFilter',
      filterer: rangeFilterer,
      filterComponent: TableRangeFilter,
    },
  },
};

export const COLUMNS = [
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

export const TRANSFORMED_COLUMNS = [
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

export const SORTED_2_TIMES_ROWS = [
  {
    id: 'row3',
    field: 'Красноленинская группа',
    year: 1985,
    type: 'Комбинированное',
    estimatedReserves: 8766,
    remainingReserves: 3374,
    production: 256,
    total: 434,
  },
  {
    id: 'row2',
    field: 'Уренгойское газонефтеконденсат­ное',
    year: 2001,
    type: 'Конденсатное',
    estimatedReserves: 7540,
    remainingReserves: 7540,
    production: 363,
    total: 88,
  },
  {
    id: 'row4',
    field: 'Великое',
    year: 1989,
    type: 'Конденсатное',
    estimatedReserves: 1697,
    remainingReserves: 4818,
    production: 250,
    total: 236,
  },
  {
    id: 'row5',
    field: 'Русское газонефтяное',
    year: 1997,
    type: 'Нефтяное',
    estimatedReserves: 5169,
    remainingReserves: 3712,
    production: 292,
    total: 417,
  },
  {
    id: 'row1',
    field: 'Приобское',
    year: 1982,
    type: 'Нефтяное',
    estimatedReserves: 5000,
    remainingReserves: 1700,
    production: 33,
    total: 313,
  },
];

export const generateData = (rowsCount: number, columnsCount: number) => {
  const rows = [];
  const columns = [];

  for (let i = 1; i <= columnsCount; i++) {
    columns.push({
      title: `заголовок ${i}`,
      accessor: `column${i}`,
    });
  }

  for (let i = 1; i <= rowsCount; i++) {
    const row: { id: string; [key: string]: string } = { id: `${i}` };

    for (let j = 1; j <= columnsCount; j++) {
      row[`column${j}`] = `строка_${i} столбец_${j}`;
    }

    rows.push(row);
  }

  return { rows, columns };
};

export const tableWithMergedCellsData = {
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
      mergeCells: true,
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
      title: 'Смена 1',
      accessor: 'responsible1',
      align: 'left',
      mergeCells: true,
    },
    {
      title: 'Смена 2',
      accessor: 'responsible2',
      align: 'left',
      sortable: true,
      mergeCells: true,
    },
  ],
  rows: rowsForMultiLevelHeadersData,
};
