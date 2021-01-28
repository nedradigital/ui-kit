import { useState } from 'react';

import { isDefined } from '../../utils/type-guards';

import { RowField, TableRow } from './Table';

export type Filter<T extends TableRow> = {
  id: string;
  field: RowField<T>;
  filterer: (value: any, filterValue: FilterValue) => boolean;
  filterComponent: React.FC<any>;
  filterComponentProps?: any;
  initialValue?: FilterValue;
};

export type FilterValue = any;

export type Filters<T extends TableRow> = { [key in RowField<T>]?: Filter<T> };

export type SortByProps<T extends TableRow> = {
  sortingBy: keyof T;
  sortOrder: 'asc' | 'desc';
};

export type onSortBy<T extends TableRow> = (props: SortByProps<T> | null) => void;

type SelectedFitler<T extends TableRow> = Filter<T> & { value: FilterValue; isActive: boolean };

export type SelectedFilters<T extends TableRow> = {
  [field in RowField<T>]: SelectedFitler<T>;
};

export const getSelectedFiltersInitialState = <T extends TableRow>(
  filters?: Filters<T>,
): SelectedFilters<T> => {
  if (!filters) {
    return {} as SelectedFilters<T>;
  }

  return Object.keys(filters).reduce<SelectedFilters<T>>((fieldAcc, fieldCur) => {
    if (!fieldAcc[fieldCur]) {
      return {
        ...fieldAcc,
        [fieldCur]: {
          ...filters[fieldCur],
          isActive: isDefined(filters[fieldCur]?.initialValue),
          value: filters[fieldCur]?.initialValue,
        },
      };
    }

    return fieldAcc;
  }, {} as SelectedFilters<T>);
};

export const fieldFiltersPresent = <T extends TableRow>(
  tableFilters: Filters<T>,
  field: RowField<T>,
): boolean => {
  return Object.keys(tableFilters).includes(field);
};

export const isSomeFilterActive = <T extends TableRow>(
  selectedFilters: SelectedFilters<T>,
): boolean => {
  return Object.values(selectedFilters).some(({ isActive }) => isActive);
};

export const filterTableData = <T extends TableRow>({
  data,
  selectedFilters,
}: {
  data: T[];
  selectedFilters: SelectedFilters<T>;
}): T[] => {
  const mutableFilteredData = [];

  for (const row of data) {
    const columnNames = Object.keys(row);
    let rowIsValid = true;

    for (const columnName of columnNames) {
      const columnFilter = selectedFilters[columnName];

      if (columnFilter && columnFilter.isActive) {
        let cellIsValid = false;

        const cellContent = row[columnName];

        if (columnFilter.filterer(cellContent, columnFilter.value)) {
          cellIsValid = true;
          break;
        }

        if (!cellIsValid) {
          rowIsValid = false;
        }
      }

      if (!rowIsValid) {
        break;
      }
    }

    if (rowIsValid) {
      mutableFilteredData.push(row);
    }
  }

  return mutableFilteredData;
};

/* istanbul ignore next */
export const useSelectedFilters = <T extends TableRow>(
  filters?: Filters<T>,
  onFiltersUpdated?: (filters: SelectedFilters<T>) => void,
): {
  selectedFilters: SelectedFilters<T>;
  updateFilterValue: (
    field: RowField<T>,
    filterValue: { value: FilterValue; isActive: boolean },
  ) => SelectedFilters<T>;
  resetSelectedFilter: (field: RowField<T>) => void;
} => {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters<T>>(
    getSelectedFiltersInitialState(filters),
  );

  const updateFilterValue = (
    field: RowField<T>,
    updatedFilter: { value: FilterValue; isActive: boolean },
  ): SelectedFilters<T> => {
    const newSelectedFilters: SelectedFilters<T> = {
      ...selectedFilters,
      [field]: {
        ...selectedFilters[field],
        value: updatedFilter.value,
        isActive: updatedFilter.isActive,
      },
    };

    setSelectedFilters(newSelectedFilters);
    onFiltersUpdated && onFiltersUpdated(newSelectedFilters);

    return newSelectedFilters;
  };

  const resetSelectedFilter = (field: RowField<T>) => {
    updateFilterValue(field, { value: undefined, isActive: false });
  };

  return {
    selectedFilters,
    resetSelectedFilter,
    updateFilterValue,
  };
};
