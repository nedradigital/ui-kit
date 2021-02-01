import React, { useMemo, useState } from 'react';

import { ChoiceGroup } from '../../ChoiceGroup/ChoiceGroup';
import { TableCustomFilterContainer } from '../CustomFilterContainer/TableCustomFilterContainer';
import { CustomFilterComponentProps } from '../customFiltering';

type Item = {
  name: string;
  value: string | undefined;
};

const defaultValue: Item = { name: 'Все', value: undefined };

type Props = CustomFilterComponentProps & {
  items?: Item[];
};

export const TableCustomFilterChoiceGroup: React.FC<Props> = ({
  onConfirm,
  items = [],
  savedCustomFilterValue,
}) => {
  const [value, setValue] = useState<Item | null>(savedCustomFilterValue || null);

  const confirmHandler = () => {
    onConfirm({ value: value?.value ? value : undefined, isActive: Boolean(value?.value) });
  };

  const resetHandler = () => {
    setValue(null);
  };

  const choiceGroupItems = useMemo(() => [defaultValue, ...items], [items]);

  const onChange = ({ value }: { value: Item }) => {
    setValue(value);
  };

  return (
    <TableCustomFilterContainer
      title="Отобразить значения из списка"
      onReset={resetHandler}
      onConfirm={confirmHandler}
      resetButtonDisabled={value?.value === undefined}
    >
      <ChoiceGroup
        size="s"
        items={choiceGroupItems}
        getLabel={(item) => item.name}
        name="choiceGroup"
        onChange={onChange}
        value={value?.value ? value : defaultValue}
        multiple={false}
      />
    </TableCustomFilterContainer>
  );
};
