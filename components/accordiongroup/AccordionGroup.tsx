import { AccordionTilstandProvider } from 'context/saksbehandling/AccordionTilstandContext';
import { ReactNode } from 'react';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: ReactNode;
}

export const AccordionGroup = ({ children, isOpen, setIsOpen }: Props) => {
  return (
    <AccordionTilstandProvider accordionTilstand={{ isOpen, setIsOpen }}>
      <div>
        <button type={'button'} onClick={() => setIsOpen(true)}>
          Åpen
        </button>
        <button type={'button'} onClick={() => setIsOpen(false)}>
          Lukket
        </button>
        {children}
      </div>
    </AccordionTilstandProvider>
  );
};
