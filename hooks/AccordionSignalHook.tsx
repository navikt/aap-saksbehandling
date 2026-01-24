import { useState } from 'react';

type AccordionSignalAction = 'open' | 'close';

export interface AccordionsSignal {
  action: AccordionSignalAction;
  version: number;
}

export function useAccordionsSignal() {
  const [accordionsSignal, setAccordionsSignal] = useState<AccordionsSignal>({
    action: 'close',
    version: 0,
  });

  const openAllAccordions = () => {
    setAccordionsSignal((s) => ({
      action: 'open',
      version: s.version + 1,
    }));
  };

  const closeAllAccordions = () => {
    setAccordionsSignal((s) => ({
      action: 'close',
      version: s.version + 1,
    }));
  };

  return {
    accordionsSignal,
    openAllAccordions,
    closeAllAccordions,
  };
}
