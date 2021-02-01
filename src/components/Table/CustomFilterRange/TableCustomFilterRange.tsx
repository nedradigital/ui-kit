import './TableCustomFilterRange.css';

import React, { useState } from 'react';

import { cn } from '../../../utils/bem';
import { isNotNil } from '../../../utils/type-guards';
import { TextField } from '../../TextField/TextField';
import { TableCustomFilterContainer } from '../CustomFilterContainer/TableCustomFilterContainer';
import { CustomFilterComponentProps } from '../customFiltering';

const customFilterRange = cn('TableCustomFilterRange');

type Props = CustomFilterComponentProps;

export const TableCustomFilterRange: React.FC<Props> = ({ onConfirm, savedCustomFilterValue }) => {
  const [minValue, setMinValue] = useState<string | undefined | null>(savedCustomFilterValue.min);
  const [maxValue, setMaxValue] = useState<string | undefined | null>(savedCustomFilterValue.max);

  const confirmHandler = () => {
    onConfirm({
      value: {
        min: minValue,
        max: maxValue,
      },
      isActive: isNotNil(minValue) || isNotNil(maxValue),
    });
  };

  const resetHandler = () => {
    setMinValue(undefined);
    setMaxValue(undefined);
  };

  return (
    <TableCustomFilterContainer
      title="Фильтровать по диапазону значений"
      onReset={resetHandler}
      onConfirm={confirmHandler}
      resetButtonDisabled={!isNotNil(minValue) && !isNotNil(maxValue)}
    >
      <div className={customFilterRange('Inputs')}>
        <TextField
          placeholder="от"
          value={minValue}
          onChange={(e) => setMinValue(e.value)}
          form="defaultBrick"
          size="s"
        />
        <TextField
          placeholder="до"
          value={maxValue}
          onChange={(e) => setMaxValue(e.value)}
          form="clearDefault"
          size="s"
        />
      </div>
    </TableCustomFilterContainer>
  );
};
