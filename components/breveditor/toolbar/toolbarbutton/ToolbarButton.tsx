import { ReactNode } from 'react';
import { Button } from '@navikt/ds-react';

interface ToolbarButtonProps {
  onClick: () => void;
  className: string;
  children: ReactNode;
}

export const ToolbarButton = ({ onClick, className, children }: ToolbarButtonProps) => {
  return (
    <Button type={'button'} variant={'tertiary-neutral'} onClick={() => onClick()} className={className}>
      {children}
    </Button>
  );
};
