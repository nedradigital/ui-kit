import { useState } from 'react';

import { isDefined } from '../../utils/type-guards';

import { TableRow, ValueOf } from './Table';

export type CustomFilterValue = any;
export type CustomFilterComponentProps = {
  onConfirm: (value: { value: CustomFilterValue; isActive: boolean }) => void;
  savedCustomFilterValue: CustomFilterValue;
  [key: string]: any;
};

export type CustomFilter<T extends TableRow> = ValueOf<
  {
    [K in keyof T]: {
      filterer: (value: T[K], filterValue: CustomFilterValue) => boolean;
      filterComponent: React.FC<CustomFilterComponentProps>;
      filterComponentProps?: { [key: string]: any };
      initialValue?: CustomFilterValue;
    };
  }
>;

export type CustomFilters<T extends TableRow> = { [key in keyof T]?: CustomFilter<T> };

type CustomSavedFilter<T extends TableRow> = CustomFilter<T> & {
  value: CustomFilterValue;
  isActive: boolean;
};

export type CustomSavedFilters<T extends TableRow> = {
  [field in keyof T]?: CustomSavedFilter<T>;
};

export const getSavedCustomFiltersInitialState = <T extends TableRow>(
  filters?: CustomFilters<T>,
): CustomSavedFilters<T> => {
  if (!filters) {
    return {} as CustomSavedFilters<T>;
  }

  return Object.keys(filters).reduce<CustomSavedFilters<T>>((fieldAcc, fieldCur) => {
    if (!fieldAcc[fieldCur as keyof T]) {
      return {
        ...fieldAcc,
        [fieldCur]: {
          ...filters[fieldCur as keyof T],
          isActive: isDefined(filters[fieldCur as keyof T]?.initialValue),
          value: filters[fieldCur as keyof T]?.initialValue,
        },
      };
    }

    return fieldAcc;
  }, {});
};

export const fieldCustomFilterPresent = <T extends TableRow>(
  tableFilters: CustomFilters<T>,
  field: keyof T,
): boolean => {
  return Object.keys(tableFilters).includes(field as string);
};

export const isSomeCustomFilterActive = <T extends TableRow>(
  savedFilters: CustomSavedFilters<T>,
): boolean => {
  return Object.values(savedFilters).some((filter) => filter && filter.isActive);
};

export const useCustomFilters = <T extends TableRow>(
  filters?: CustomFilters<T>,
  onFiltersUpdated?: (filters: CustomSavedFilters<T>) => void,
): {
  savedCustomFilters: CustomSavedFilters<T>;
  updateCustomFilterValue: (
    field: string,
    filterValue: { value: CustomFilterValue; isActive: boolean },
  ) => CustomSavedFilters<T>;
} => {
  const [savedCustomFilters, setSavedCustomFilters] = useState<CustomSavedFilters<T>>(
    getSavedCustomFiltersInitialState(filters),
  );

  const updateCustomFilterValue = (
    field: string,
    updatedFilter: { value: CustomFilterValue; isActive: boolean },
  ): CustomSavedFilters<T> => {
    const newSavedFilters: CustomSavedFilters<T> = {
      ...savedCustomFilters,
      [field]: {
        ...savedCustomFilters[field as keyof T],
        value: updatedFilter.value,
        isActive: updatedFilter.isActive,
      },
    };

    setSavedCustomFilters(newSavedFilters);
    onFiltersUpdated && onFiltersUpdated(newSavedFilters);

    return newSavedFilters;
  };

  return {
    savedCustomFilters,
    updateCustomFilterValue,
  };
};
