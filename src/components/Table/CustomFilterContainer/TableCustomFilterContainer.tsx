import './TableCustomFilterContainer.css';

import React from 'react';

import { cn } from '../../../utils/bem';
import { Button } from '../../Button/Button';
import { Text } from '../../Text/Text';

const cnTableCustomFilterContainer = cn('TableCustomFilterContainer');

export type Props = {
  onReset: () => void;
  onConfirm: () => void;
  title?: string;
  confirmButtonLabel?: string;
  resetButtonLabel?: string;
  resetButtonDisabled?: boolean;
};

export const TableCustomFilterContainer: React.FC<Props> = ({
  onConfirm,
  title,
  confirmButtonLabel = 'Применить',
  resetButtonLabel = 'Сбросить фильтр',
  onReset,
  resetButtonDisabled = false,
  children,
}) => {
  return (
    <div className={cnTableCustomFilterContainer('Content')}>
      {title && (
        <Text
          view="primary"
          size="m"
          className={cnTableCustomFilterContainer('Title')}
          lineHeight="l"
        >
          {title}
        </Text>
      )}
      {children}
      <div className={cnTableCustomFilterContainer('ConfirmButtons')}>
        <Button
          label={resetButtonLabel}
          size="s"
          view="ghost"
          onClick={onReset}
          disabled={resetButtonDisabled}
        />
        <Button label={confirmButtonLabel} size="s" view="primary" onClick={onConfirm} />
      </div>
    </div>
  );
};
