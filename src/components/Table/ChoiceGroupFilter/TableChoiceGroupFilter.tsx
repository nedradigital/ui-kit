import React, { useEffect, useMemo, useState } from 'react';

import { isDefined } from '../../../utils/type-guards';
import { ChoiceGroup } from '../../ChoiceGroup/ChoiceGroup';
import {
  TableFilterTooltip,
  TableFilterTooltipProps,
  TableFilterTooltipTextProps,
} from '../FilterTooltip/TableFilterTooltip';

type Item = {
  name: string;
  value: any;
};

const defaultValue: Item = { name: 'Все', value: undefined };

type Props = TableFilterTooltipProps & {
  items: Item[];
  onConfirm: (field: string, filterValue: { value: Item | undefined; isActive: boolean }) => void;
  savedValue: null | Item;
};

export type TableChoiceGroupFilterProps = TableFilterTooltipTextProps & Pick<Props, 'items'>;

export const TableChoiceGroupFilter: React.FC<Props> = ({
  isOpened,
  className,
  onToggle,
  onConfirm,
  items,
  field,
  title = 'Отобразить значения из списка',
  confirmButtonLabel,
  resetButtonLabel,
  savedValue,
  columnEl,
}) => {
  const [value, setValue] = useState<Item | null>(null);

  useEffect(() => {
    setValue(savedValue || null);
  }, [savedValue, isOpened]);

  const confirmHandler = () => {
    onConfirm(field, { value: value?.value ? value : undefined, isActive: value?.value });
    onToggle();
  };

  const resetHandler = () => {
    setValue(null);
  };

  const choiceGroupItems = useMemo(() => [defaultValue, ...items], [items]);

  const onChange = ({ value }: { value: Item }) => {
    setValue(value);
  };

  return (
    <TableFilterTooltip
      columnEl={columnEl}
      isActive={isDefined(savedValue)}
      field={field}
      title={title}
      confirmButtonLabel={confirmButtonLabel}
      resetButtonLabel={resetButtonLabel}
      isOpened={isOpened}
      className={className}
      onToggle={onToggle}
      onReset={resetHandler}
      onConfirm={confirmHandler}
    >
      <ChoiceGroup
        size="s"
        items={choiceGroupItems}
        getLabel={(item) => item.name}
        name={field}
        onChange={onChange}
        value={value?.value ? value : defaultValue}
        multiple={false}
      />
    </TableFilterTooltip>
  );
};
