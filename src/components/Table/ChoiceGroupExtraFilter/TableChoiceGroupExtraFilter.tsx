import React, { useMemo, useState } from 'react';

import { ChoiceGroup } from '../../ChoiceGroup/ChoiceGroup';
import {
  TableExtraFilterTooltip,
  TableExtraFilterTooltipProps,
  TableExtraFilterTooltipTextProps,
} from '../ExtraFilterTooltip/TableExtraFilterTooltip';

type Item = {
  name: string;
};

type Props = TableExtraFilterTooltipProps & {
  items: Item[];
  onConfirm: (field: string, value: Item | null) => void;
  savedValue: null | Item;
};

export type TableChoiceGroupExtraFilterProps = TableExtraFilterTooltipTextProps &
  Pick<Props, 'items'>;

export const TableChoiceGroupExtraFilter: React.FC<Props> = ({
  isOpened,
  className,
  onToggle,
  onReset,
  onConfirm,
  items,
  field,
  title = 'Отобразить значения из списка',
  confirmButtonLabel,
  resetButtonLabel,
  savedValue,
}) => {
  const [value, setValue] = useState<Item | null>(null);

  const defaultValue = { name: 'Все' };

  const confirmHandler = () => {
    onConfirm(field, value?.name === defaultValue.name ? null : value);
    onToggle();
  };

  const resetHandler = () => {
    onReset();
    setValue(null);
    onToggle();
  };

  const choiceGroupItems = useMemo(() => [defaultValue, ...items], [items]);

  return (
    <TableExtraFilterTooltip
      isActive={savedValue !== null}
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
        onChange={({ value }) => {
          setValue(value);
        }}
        value={value === null ? defaultValue : value}
        multiple={false}
      />
    </TableExtraFilterTooltip>
  );
};
