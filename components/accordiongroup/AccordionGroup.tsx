import { AccordionTilstandProvider } from 'context/saksbehandling/AccordionTilstandContext';
import { ReactNode } from 'react';

interface Props {
  isOpen: boolean | undefined;
  setIsOpen: (value: boolean | undefined) => void;
  children: ReactNode;
}

export const AccordionGroup = ({ children, isOpen, setIsOpen }: Props) => {
  return (
    <AccordionTilstandProvider isOpen={isOpen} setIsOpen={setIsOpen}>
      {children}
    </AccordionTilstandProvider>
  );
};
