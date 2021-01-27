import { useState } from 'react';

import { isDefined } from '../../utils/type-guards';

import { TableCheckboxGroupExtraFilterProps } from './CheckboxGroupExtraFilter/TableCheckboxGroupExtraFilter';
import { TableChoiceGroupExtraFilterProps } from './ChoiceGroupExtraFilter/TableChoiceGroupExtraFilter';
import { TableRangeExtraFilterProps } from './RangeExtraFilter/TableRangeExtraFilter';
import { RowField, TableColumn, TableRow } from './Table';

export type Filters<T extends TableRow> = Array<{
  id: string;
  name: string;
  field: RowField<T>;
  filterer: (value: any) => boolean;
}>;

export type ExtraFilter = {
  filterer: (cellValue: any, filterValue: any) => boolean;
  id: string;
  tooltip:
    | { type: 'range'; props: TableRangeExtraFilterProps }
    | {
        type: 'choiceGroup';
        props: TableChoiceGroupExtraFilterProps;
      }
    | {
        type: 'checkboxGroup';
        props: TableCheckboxGroupExtraFilterProps;
      };
};

export type ExtraFilters<T extends TableRow> = {
  [key in RowField<T>]: ExtraFilter | undefined;
};

export type ExtraFiltersValues = {
  [key: string]: ExtraFilterValue;
};

export type ExtraFilterValue = null | Array<{ name: string }> | { name: string };

export type SortByProps<T extends TableRow> = {
  sortingBy: keyof T;
  sortOrder: 'asc' | 'desc';
};

export type onSortBy<T extends TableRow> = (props: SortByProps<T> | null) => void;

export type FieldSelectedValues = string[];

export type SelectedFilters = { [field: string]: FieldSelectedValues | undefined };

type SelectedFiltersList = Array<{
  id: string;
  name: string;
}>;

export const getOptionsForFilters = <T extends TableRow>(
  filters: Filters<T>,
  field: RowField<T>,
): { value: string; label: string }[] => {
  return filters
    .filter(({ field: filterField }) => filterField === field)
    .map(({ id, name }) => ({ value: id, label: name }));
};

export const getSelectedFiltersInitialState = <T extends TableRow>(
  filters?: Filters<T>,
): SelectedFilters => {
  if (!filters) {
    return {};
  }

  return filters.reduce<SelectedFilters>((fieldAcc, fieldCur) => {
    if (!fieldAcc[fieldCur.field]) {
      return {
        ...fieldAcc,
        [fieldCur.field]: [],
      };
    }

    return fieldAcc;
  }, {});
};

export const fieldFiltersPresent = <T extends TableRow>(
  tableFilters: Filters<T>,
  field: RowField<T>,
): boolean => {
  return tableFilters.some(({ field: filterField }) => filterField === field);
};

export const isSelectedFiltersPresent = (selectedFilters: SelectedFilters): boolean => {
  return Object.values(selectedFilters).some(
    (filterGroup) => filterGroup && filterGroup.length > 0,
  );
};

export const getSelectedFiltersList = <T extends TableRow>({
  filters,
  selectedFilters,
  columns,
}: {
  filters: Filters<T>;
  selectedFilters: SelectedFilters;
  columns: Array<TableColumn<T>>;
}): SelectedFiltersList => {
  return columns.reduce<SelectedFiltersList>((acc, cur) => {
    const currentFieldFilters = selectedFilters[cur.accessor] || [];
    let orderedFilters: SelectedFiltersList = [];

    if (currentFieldFilters.length) {
      orderedFilters = currentFieldFilters
        .map((filter) => {
          const option = filters.find(({ id: filterId }) => filterId === filter);

          return option
            ? {
                id: option.id,
                name: option.name,
              }
            : undefined;
        })
        .filter(isDefined);
    }

    return currentFieldFilters.length ? [...acc, ...orderedFilters] : acc;
  }, []);
};

export const filterTableData = <T extends TableRow>({
  data,
  filters = [],
  selectedFilters,
  extraFilters,
  extraFiltersValues,
}: {
  data: T[];
  filters?: Filters<T>;
  selectedFilters: SelectedFilters;
  extraFilters?: ExtraFilters<T>;
  extraFiltersValues?: ExtraFiltersValues;
}): T[] => {
  const mutableFilteredData = [];

  for (const row of data) {
    const columnNames = Object.keys(row);

    let rowIsValid = true;

    for (const columnName of columnNames) {
      const columnFilters = selectedFilters[columnName];

      const columnExtraFilter = extraFilters && extraFilters[columnName];

      if (columnExtraFilter && extraFiltersValues && extraFiltersValues[columnName]) {
        const cellContent = row[columnName];

        if (!columnExtraFilter.filterer(cellContent, extraFiltersValues[columnName])) {
          rowIsValid = false;
          break;
        }
      }

      if (columnFilters && columnFilters.length) {
        let cellIsValid = false;
        const cellContent = row[columnName];

        for (const filterId of columnFilters) {
          const filter = filters.find(({ id }) => id === filterId);

          if (filter && filter.filterer(cellContent)) {
            cellIsValid = true;
            break;
          }
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
  onFiltersUpdated?: (filters: SelectedFilters) => void,
): {
  selectedFilters: SelectedFilters;
  updateSelectedFilters: (field: string, tooltipSelectedFilters: FieldSelectedValues) => void;
  removeOneSelectedFilter: (availableFilters: Filters<T>, filter: string) => void;
  removeAllSelectedFilters: (availableFilters: Filters<T>) => void;
} => {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(
    getSelectedFiltersInitialState(filters),
  );

  const updateSelectedFilters = (
    field: string,
    tooltipSelectedFilters: FieldSelectedValues,
  ): void => {
    const newSelectedFilters = {
      ...selectedFilters,
      [field]: [...tooltipSelectedFilters],
    };

    setSelectedFilters(newSelectedFilters);
    onFiltersUpdated && onFiltersUpdated(newSelectedFilters);
  };

  const removeOneSelectedFilter = (availableFilters: Filters<T>, filter: string): void => {
    const filterToDelete = availableFilters.find(({ id }) => id === filter);

    if (filterToDelete) {
      updateSelectedFilters(
        filterToDelete.field,
        (selectedFilters[filterToDelete.field] || []).filter((f) => f !== filter),
      );
    }
  };

  const removeAllSelectedFilters = (availableFilters: Filters<T>): void => {
    setSelectedFilters(getSelectedFiltersInitialState(availableFilters));
  };

  return {
    selectedFilters,
    updateSelectedFilters,
    removeOneSelectedFilter,
    removeAllSelectedFilters,
  };
};

const getAllExtraFiltersInitialState = <T extends TableRow>(
  extraFilters: ExtraFilters<T> | undefined,
) => {
  if (!extraFilters) {
    return {};
  }

  return Object.keys(extraFilters).reduce<ExtraFiltersValues>((acc, field) => {
    if (!acc[field]) {
      acc[field] = null;
    }

    return acc;
  }, {});
};

export const useExtraFilters = <T extends TableRow>(
  extraFilters?: ExtraFilters<T>,
): {
  extraFiltersValues: ExtraFiltersValues;
  updateExtraFilterValue: (field: string, value: any) => void;
  resetExtraFilterValue: (field: string) => void;
} => {
  const [extraFiltersValues, setExtraFiltersValues] = useState(
    getAllExtraFiltersInitialState(extraFilters),
  );

  const updateExtraFilterValue = (field: string, value: any) => {
    setExtraFiltersValues({ ...extraFiltersValues, [field]: value });
  };

  const resetExtraFilterValue = (field: string) => {
    updateExtraFilterValue(field, null);
  };

  return { extraFiltersValues, updateExtraFilterValue, resetExtraFilterValue };
};
