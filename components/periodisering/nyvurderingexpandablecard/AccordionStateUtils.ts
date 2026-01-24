export type AccordionState = {
  [id: string]: {
    isOpen: boolean;
  };
};

type AccordionAction =
  | { type: 'ADD'; id: string; initialOpen: boolean }
  | { type: 'REMOVE'; id: string }
  | { type: 'OPEN_ALL' }
  | { type: 'CLOSE_ALL' }
  | { type: 'SET_OPEN'; id: string; isOpen: boolean };

export function accordionReducer(state: AccordionState, action: AccordionAction): AccordionState {
  switch (action.type) {
    case 'ADD':
      if (state[action.id]) return state;
      return {
        ...state,
        [action.id]: { isOpen: action.initialOpen },
      };

    case 'REMOVE': {
      return Object.fromEntries(Object.entries(state).filter(([id]) => id !== action.id));
    }

    case 'OPEN_ALL':
      return Object.fromEntries(Object.keys(state).map((id) => [id, { isOpen: true }]));

    case 'CLOSE_ALL':
      return Object.fromEntries(Object.keys(state).map((id) => [id, { isOpen: false }]));

    case 'SET_OPEN':
      return {
        ...state,
        [action.id]: { isOpen: action.isOpen },
      };

    default:
      return state;
  }
}
