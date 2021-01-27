import './TableRangeExtraFilter.css';

import React, { useMemo, useState } from 'react';

import { cn } from '../../../utils/bem';
import { TextField } from '../../TextField/TextField';
import {
  TableExtraFilterTooltip,
  TableExtraFilterTooltipProps,
  TableExtraFilterTooltipTextProps,
} from '../ExtraFilterTooltip/TableExtraFilterTooltip';

const cnRangeExtraFilter = cn('TableRangeExtraFilter');

type Props = TableExtraFilterTooltipProps & {
  onConfirm: (field: string, value: { min: number | null; max: number | null }) => void;
  savedValue: { min: null | number; max: null | number };
};

export type TableRangeExtraFilterProps = TableExtraFilterTooltipTextProps;

export const TableRangeExtraFilter: React.FC<Props> = ({
  isOpened,
  className,
  onToggle,
  onReset,
  onConfirm,
  confirmButtonLabel,
  resetButtonLabel,
  savedValue,
  title = 'Фильтровать по диапазону значений',
  field,
}) => {
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);

  const isActive = useMemo(
    () => savedValue && (savedValue.min !== null || savedValue.max !== null),
    [savedValue],
  );

  const confirmHandler = () => {
    onConfirm(field, { min: minValue, max: maxValue });
    onToggle();
  };

  const resetHandler = () => {
    onReset();
    setMinValue(null);
    setMaxValue(null);
    onToggle();
  };

  return (
    <TableExtraFilterTooltip
      field={field}
      isActive={isActive}
      title={title}
      isOpened={isOpened}
      className={className}
      onToggle={onToggle}
      onReset={resetHandler}
      onConfirm={confirmHandler}
      confirmButtonLabel={confirmButtonLabel}
      resetButtonLabel={resetButtonLabel}
    >
      <div className={cnRangeExtraFilter('Inputs')}>
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
    </TableExtraFilterTooltip>
  );
};
