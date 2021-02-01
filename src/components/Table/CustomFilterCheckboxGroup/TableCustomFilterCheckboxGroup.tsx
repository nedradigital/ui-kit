import './TableCustomFilterCheckboxGroup.css';

import React, { useMemo, useState } from 'react';

import { IconSearch } from '../../../icons/IconSearch/IconSearch';
import { cn } from '../../../utils/bem';
import { Checkbox } from '../../Checkbox/Checkbox';
import { CheckboxGroup } from '../../CheckboxGroup/CheckboxGroup';
import { TextField } from '../../TextField/TextField';
import { TableCustomFilterContainer } from '../CustomFilterContainer/TableCustomFilterContainer';
import { CustomFilterComponentProps } from '../customFiltering';

const cnCustomFilterCheckboxGroup = cn('TableCustomFilterCheckboxGroup');

type Item = {
  name: string;
  value: string;
};

type Props = CustomFilterComponentProps & {
  items?: Item[];
  withSearch?: boolean;
};

export const TableCustomFilterCheckboxGroup: React.FC<Props> = ({
  items = [],
  withSearch = false,
  onConfirm,
  savedCustomFilterValue,
}) => {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [checkboxGroupValue, setCheckboxGroupValue] = useState<Item[] | null>(
    savedCustomFilterValue || items,
  );

  const confirmHandler = () => {
    setSearchValue(null);
    onConfirm({
      value: checkboxGroupValue === null ? [] : checkboxGroupValue,
      isActive: Boolean(!checkboxGroupValue || checkboxGroupValue.length !== items.length),
    });
  };

  const resetHandler = () => {
    setSearchValue(null);
    setCheckboxGroupValue(items);
  };

  const filteredItems = useMemo(() => {
    if (!searchValue) {
      return items;
    }

    return items.filter(({ name }) => {
      return name.match(new RegExp(`${searchValue}`, 'i'));
    });
  }, [searchValue, items]);

  const allSelected = useMemo(() => items.length === checkboxGroupValue?.length, [
    items,
    checkboxGroupValue,
  ]);

  return (
    <TableCustomFilterContainer
      title="Фильтровать по выбранным из списка"
      onReset={resetHandler}
      onConfirm={confirmHandler}
      resetButtonDisabled={allSelected}
    >
      {withSearch && (
        <TextField
          value={searchValue}
          onChange={({ value }) => setSearchValue(value)}
          leftSide={IconSearch}
          size="s"
          placeholder="Найти в списке"
          width="full"
          className={cnCustomFilterCheckboxGroup('Searchbar')}
        />
      )}

      <Checkbox
        className={cnCustomFilterCheckboxGroup('AllCheckbox')}
        checked={allSelected}
        label="Выбрать все"
        onChange={() => {
          setCheckboxGroupValue(allSelected ? null : items);
        }}
      />

      <CheckboxGroup
        className={cnCustomFilterCheckboxGroup('Checkboxes')}
        items={filteredItems}
        value={checkboxGroupValue}
        getLabel={(item) => item.name}
        onChange={({ value }) => {
          setCheckboxGroupValue(value);
        }}
        name="checkboxGroup"
      />
    </TableCustomFilterContainer>
  );
};
