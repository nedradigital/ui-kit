import './TableCustomFilterPopover.css';

import React from 'react';

import { IconFunnel } from '../../../icons/IconFunnel/IconFunnel';
import { cn } from '../../../utils/bem';
import { Button } from '../../Button/Button';
import { Popover } from '../../Popover/Popover';

const cnTableCustomFilterPopover = cn('TableCustomFilterPopover');

type Props = {
  isOpened: boolean;
  isActive: boolean;
  onToggle: () => void;
  className?: string;
  columnRef: React.RefObject<HTMLElement>;
};

export const TableCustomFilterPopover: React.FC<Props> = ({
  isOpened,
  onToggle,
  className,
  children,
  columnRef,
  isActive,
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
        className={cnTableCustomFilterPopover('Button', { isOpened, isActive }, [className])}
        iconLeft={IconFunnel}
      />
      {isOpened && buttonRef.current && (
        <Popover
          anchorRef={columnRef}
          possibleDirections={['downRight', 'downLeft', 'downCenter']}
          direction="downCenter"
          offset={8}
          arrowOffset={12}
          onClickOutside={onToggle}
        >
          {children}
        </Popover>
      )}
    </>
  );
};
