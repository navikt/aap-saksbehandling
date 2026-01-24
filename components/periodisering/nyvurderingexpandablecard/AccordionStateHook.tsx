import { useReducer } from 'react';
import { accordionReducer } from 'components/periodisering/nyvurderingexpandablecard/AccordionStateUtils';

interface Accordion {
  id: string;
  initialOpen: boolean;
}

export function useAccordionsReducer(initialAccordions: Accordion[]) {
  const [accordionsState, dispatch] = useReducer(accordionReducer, initialAccordions, (accordions) =>
    Object.fromEntries(accordions.map((accordion) => [accordion.id, { isOpen: accordion.initialOpen }]))
  );

  return {
    accordionsState,
    addAccordion: (id: string, initialOpen: boolean) => dispatch({ type: 'ADD', id, initialOpen }),
    removeAccordion: (id: string) => dispatch({ type: 'REMOVE', id }),
    openAllAccordions: () => dispatch({ type: 'OPEN_ALL' }),
    closeAllAccordions: () => dispatch({ type: 'CLOSE_ALL' }),
    setOpen: (id: string, isOpen: boolean) => dispatch({ type: 'SET_OPEN', id, isOpen }),
  };
}
