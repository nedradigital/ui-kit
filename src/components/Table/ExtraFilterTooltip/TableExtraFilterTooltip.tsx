import './TableExtraFilterTooltip.css';

import React from 'react';

import { IconFunnel } from '../../../icons/IconFunnel/IconFunnel';
import { cn } from '../../../utils/bem';
import { Button } from '../../Button/Button';
import { Popover } from '../../Popover/Popover';
import { Text } from '../../Text/Text';

const cnTableExtraFilterTooltip = cn('TableExtraFilterTooltip');

export type TableExtraFilterTooltipProps = {
  onToggle: () => void;
  onConfirm: () => void;
  onReset: () => void;
  isOpened: boolean;
  field: string;
  isActive?: boolean;
  title?: string;
  confirmButtonLabel?: string;
  resetButtonLabel?: string;
  className?: string;
};

export type TableExtraFilterTooltipTextProps = Pick<
  TableExtraFilterTooltipProps,
  'title' | 'confirmButtonLabel' | 'resetButtonLabel'
>;

export const TableExtraFilterTooltip: React.FC<TableExtraFilterTooltipProps> = ({
  isOpened,
  isActive,
  className,
  title,
  onToggle,
  onReset,
  onConfirm,
  children,
  confirmButtonLabel = 'Применить',
  resetButtonLabel = 'Сбросить фильтр',
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={buttonRef}
        size="xs"
        iconSize="s"
        view="clear"
        onlyIcon
        onClick={onToggle}
        className={cnTableExtraFilterTooltip('Button', { isOpened, isActive }, [className])}
        iconLeft={IconFunnel}
      />
      {isOpened && buttonRef.current && (
        <Popover
          anchorRef={buttonRef}
          possibleDirections={['downRight', 'downLeft']}
          direction="downCenter"
          offset={4}
          arrowOffset={12}
          onClickOutside={onToggle}
        >
          <div className={cnTableExtraFilterTooltip('Content')}>
            {title && (
              <Text
                view="primary"
                size="m"
                className={cnTableExtraFilterTooltip('Title')}
                lineHeight="l"
              >
                {title}
              </Text>
            )}
            {children}
            <div className={cnTableExtraFilterTooltip('ConfirmButtons')}>
              <Button label={resetButtonLabel} size="s" view="ghost" onClick={onReset} />
              <Button label={confirmButtonLabel} size="s" view="primary" onClick={onConfirm} />
            </div>
          </div>
        </Popover>
      )}
    </>
  );
};
